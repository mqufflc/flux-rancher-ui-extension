#!/usr/bin/env bash
set -euo pipefail

# shellcheck source=./lib.sh
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

require_tools
load_env
require_bootstrap_env

rancher_up
rancher_wait_ready
rancher_login
rancher_set_server_url

k3d_up

flux_bootstrap

rancher_import_cluster
rancher_wait_cluster_active

cat <<EOF >&2

--------------------------------------------------------------------
Rancher:        ${RANCHER_URL}
Login:          admin / ${RANCHER_BOOTSTRAP_PASSWORD}
k3d cluster:    ${CLUSTER_NAME} (context: ${K3D_CONTEXT})

Start the extension dev server with:

  API=${RANCHER_URL} yarn dev
--------------------------------------------------------------------
EOF
