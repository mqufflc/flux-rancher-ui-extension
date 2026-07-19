#!/usr/bin/env bash
# Shared functions for dev/up.sh, dev/stop.sh, dev/down.sh.
# Meant to be sourced, not executed directly.

DEV_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

log() { echo ">> $*" >&2; }

require_tools() {
  local missing=()
  for tool in docker k3d flux kubectl jq curl; do
    command -v "$tool" >/dev/null 2>&1 || missing+=("$tool")
  done
  if [ "${#missing[@]}" -gt 0 ]; then
    log "Missing required tools: ${missing[*]}"
    exit 1
  fi
}

load_env() {
  if [ -f "$DEV_DIR/.env" ]; then
    set -a
    # shellcheck disable=SC1091
    source "$DEV_DIR/.env"
    set +a
  fi

  : "${CLUSTER_NAME:=flux-dev}"
  : "${RANCHER_CONTAINER_NAME:=rancher-dev}"
  : "${RANCHER_VERSION:=v2.10.0}"
  : "${RANCHER_HTTPS_PORT:=8443}"
  : "${RANCHER_BOOTSTRAP_PASSWORD:=admin-password123}"
  : "${GITHUB_PATH:=clusters/$CLUSTER_NAME}"
  : "${GITHUB_BRANCH:=main}"

  RANCHER_URL="https://localhost:${RANCHER_HTTPS_PORT}"
  RANCHER_VOLUME="${RANCHER_CONTAINER_NAME}-data"
  K3D_CONTEXT="k3d-${CLUSTER_NAME}"
}

require_bootstrap_env() {
  local missing=()
  [ -n "${GITHUB_TOKEN:-}" ] || missing+=("GITHUB_TOKEN")
  [ -n "${GITHUB_OWNER:-}" ] || missing+=("GITHUB_OWNER")
  [ -n "${GITHUB_REPO:-}" ] || missing+=("GITHUB_REPO")
  if [ "${#missing[@]}" -gt 0 ]; then
    log "Missing required dev/.env values: ${missing[*]}"
    log "Copy dev/.env.example to dev/.env and fill them in."
    exit 1
  fi
}

# ---- Rancher container ----------------------------------------------------

rancher_container_exists() {
  docker ps -a --format '{{.Names}}' | grep -qx "$RANCHER_CONTAINER_NAME"
}

rancher_container_running() {
  docker ps --format '{{.Names}}' | grep -qx "$RANCHER_CONTAINER_NAME"
}

rancher_up() {
  if rancher_container_running; then
    log "Rancher container '$RANCHER_CONTAINER_NAME' already running."
    return
  fi

  if rancher_container_exists; then
    log "Starting existing Rancher container '$RANCHER_CONTAINER_NAME'."
    docker start "$RANCHER_CONTAINER_NAME" >/dev/null
    return
  fi

  log "Creating Rancher container '$RANCHER_CONTAINER_NAME' (rancher/rancher:$RANCHER_VERSION)."
  docker run -d \
    --name "$RANCHER_CONTAINER_NAME" \
    --privileged \
    -p "${RANCHER_HTTPS_PORT}:443" \
    -e CATTLE_BOOTSTRAP_PASSWORD="$RANCHER_BOOTSTRAP_PASSWORD" \
    -v "${RANCHER_VOLUME}:/var/lib/rancher" \
    "rancher/rancher:${RANCHER_VERSION}" >/dev/null
}

rancher_stop() {
  if rancher_container_exists; then
    log "Stopping Rancher container '$RANCHER_CONTAINER_NAME'."
    docker stop "$RANCHER_CONTAINER_NAME" >/dev/null
  else
    log "No Rancher container named '$RANCHER_CONTAINER_NAME' to stop."
  fi
}

rancher_down() {
  if rancher_container_exists; then
    log "Removing Rancher container '$RANCHER_CONTAINER_NAME' (data volume '$RANCHER_VOLUME' is kept)."
    docker rm -f "$RANCHER_CONTAINER_NAME" >/dev/null
  else
    log "No Rancher container named '$RANCHER_CONTAINER_NAME' to remove."
  fi
}

rancher_wait_ready() {
  log "Waiting for Rancher to respond at $RANCHER_URL ..."
  local attempts=90
  until curl -sk -f -o /dev/null "${RANCHER_URL}/ping"; do
    attempts=$((attempts - 1))
    if [ "$attempts" -le 0 ]; then
      log "Rancher did not become ready in time. Check: docker logs $RANCHER_CONTAINER_NAME"
      exit 1
    fi
    sleep 2
  done
  log "Rancher is responding."
}

# ---- Rancher API ------------------------------------------------------------

rancher_login() {
  log "Logging in to Rancher API."
  local attempts=30
  local resp
  until resp=$(curl -sk -X POST \
      -H 'Content-Type: application/json' \
      -d "{\"username\":\"admin\",\"password\":\"${RANCHER_BOOTSTRAP_PASSWORD}\"}" \
      "${RANCHER_URL}/v3-public/localProviders/local?action=login") \
      && [ "$(echo "$resp" | jq -r '.token // empty')" != "" ]; do
    attempts=$((attempts - 1))
    if [ "$attempts" -le 0 ]; then
      log "Could not log in to Rancher API. Last response: $resp"
      exit 1
    fi
    sleep 2
  done
  RANCHER_TOKEN=$(echo "$resp" | jq -r '.token')
}

rancher_api() {
  # rancher_api METHOD PATH [JSON_BODY]
  local method="$1" path="$2" body="${3:-}"
  local args=(-sk -X "$method" -H "Authorization: Bearer ${RANCHER_TOKEN}" -H 'Content-Type: application/json')
  if [ -n "$body" ]; then
    args+=(-d "$body")
  fi
  curl "${args[@]}" "${RANCHER_URL}${path}"
}

rancher_set_server_url() {
  log "Setting Rancher server-url to https://host.k3d.internal:${RANCHER_HTTPS_PORT}"
  rancher_api PUT "/v3/settings/server-url" \
    "{\"name\":\"server-url\",\"value\":\"https://host.k3d.internal:${RANCHER_HTTPS_PORT}\"}" >/dev/null
}

rancher_import_cluster() {
  log "Registering k3d cluster '$CLUSTER_NAME' with Rancher."

  local cluster_id
  cluster_id=$(rancher_api GET "/v3/cluster?name=${CLUSTER_NAME}" | jq -r '.data[0].id // empty')

  if [ -z "$cluster_id" ]; then
    cluster_id=$(rancher_api POST "/v3/cluster" "{\"type\":\"cluster\",\"name\":\"${CLUSTER_NAME}\"}" | jq -r '.id')
    log "Created Rancher cluster object '$cluster_id'."
  else
    log "Rancher cluster object '$cluster_id' already exists, reusing it."
  fi

  # Rancher reports a freshly-created cluster object's `state` as "active"
  # immediately, well before any cluster-agent has connected, so that field
  # can't be used to decide whether the import manifest still needs
  # applying. Instead check the downstream side directly: if the agent
  # deployment is already there, applying the manifest again is a harmless
  # no-op (kubectl apply is idempotent), so just always apply it.
  #
  # Right after the cluster object is created it's still "pending"/
  # transitioning while Rancher's controllers set up its backing resources
  # (namespace, RBAC, etc.), and clusterregistrationtoken creation can fail
  # transiently during that window -- so retry for a bit instead of failing
  # on the first attempt.
  local token="" resp attempts=15
  while [ "$attempts" -gt 0 ]; do
    resp=$(rancher_api POST "/v3/clusterregistrationtoken" \
      "{\"type\":\"clusterRegistrationToken\",\"clusterId\":\"${cluster_id}\"}")
    token=$(echo "$resp" | jq -r '.token // empty')
    if [ -n "$token" ]; then
      break
    fi
    attempts=$((attempts - 1))
    sleep 2
  done

  if [ -z "$token" ]; then
    log "Could not create a cluster registration token. Last API response:"
    echo "$resp" >&2
    exit 1
  fi

  # Rancher's own `manifestUrl` field points at https://host.k3d.internal:...,
  # which only resolves from *inside* the k3d cluster, not from here. The
  # manifest still needs to be fetched over a URL this shell can reach
  # (localhost) -- its contents are what tell the agent pod to phone home to
  # host.k3d.internal, and that's set independently via the server-url
  # setting, so fetching over localhost doesn't change that.
  log "Applying cluster-agent manifest to $K3D_CONTEXT."
  curl -sk "${RANCHER_URL}/v3/import/${token}_${cluster_id}.yaml" \
    | kubectl --context "$K3D_CONTEXT" apply -f -
}

rancher_wait_cluster_active() {
  # Rancher's `/v3/cluster` `state` field goes "active" as soon as the
  # cluster object exists, well before the cluster-agent has actually
  # connected, so it isn't useful here. Instead poll the k3d cluster itself
  # for the cattle-cluster-agent deployment to become ready -- that's the
  # actual signal that Rancher and the cluster are talking to each other.
  log "Waiting for the cattle-cluster-agent to come up in $K3D_CONTEXT (this can take a few minutes)..."
  local attempts=60
  while true; do
    if kubectl --context "$K3D_CONTEXT" -n cattle-system \
        rollout status deployment/cattle-cluster-agent --timeout=1s >/dev/null 2>&1; then
      log "cattle-cluster-agent is ready; cluster '$CLUSTER_NAME' should show as Active in Rancher."
      return
    fi
    attempts=$((attempts - 1))
    if [ "$attempts" -le 0 ]; then
      log "cattle-cluster-agent not ready yet. Check: kubectl --context $K3D_CONTEXT -n cattle-system get pods"
      log "and https://localhost:${RANCHER_HTTPS_PORT} manually."
      return
    fi
    sleep 5
  done
}

# ---- k3d --------------------------------------------------------------------

k3d_cluster_exists() {
  k3d cluster list -o json | jq -e ".[] | select(.name == \"${CLUSTER_NAME}\")" >/dev/null 2>&1
}

k3d_up() {
  if k3d_cluster_exists; then
    # `k3d cluster start` is a no-op for nodes that are already running, so
    # it's safe to call unconditionally instead of trying to detect state.
    log "k3d cluster '$CLUSTER_NAME' already exists, ensuring it's started."
    k3d cluster start "$CLUSTER_NAME"
  else
    log "Creating k3d cluster '$CLUSTER_NAME'."
    k3d cluster create "$CLUSTER_NAME" --config "$DEV_DIR/k3d-config.yaml"
  fi
}

k3d_stop() {
  if k3d_cluster_exists; then
    log "Stopping k3d cluster '$CLUSTER_NAME'."
    k3d cluster stop "$CLUSTER_NAME"
  else
    log "No k3d cluster named '$CLUSTER_NAME' to stop."
  fi
}

k3d_down() {
  if k3d_cluster_exists; then
    log "Deleting k3d cluster '$CLUSTER_NAME'."
    k3d cluster delete "$CLUSTER_NAME"
  else
    log "No k3d cluster named '$CLUSTER_NAME' to delete."
  fi
}

# ---- Flux ---------------------------------------------------------------

flux_bootstrap() {
  log "Bootstrapping Flux on $K3D_CONTEXT from github.com/${GITHUB_OWNER}/${GITHUB_REPO} (path: ${GITHUB_PATH})."
  GITHUB_TOKEN="$GITHUB_TOKEN" flux bootstrap github \
    --context="$K3D_CONTEXT" \
    --owner="$GITHUB_OWNER" \
    --repository="$GITHUB_REPO" \
    --branch="$GITHUB_BRANCH" \
    --path="$GITHUB_PATH" \
    --personal \
    --token-auth
}
