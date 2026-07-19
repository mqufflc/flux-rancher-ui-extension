# Local dev environment

Spins up everything needed to develop this extension against a real cluster:
a [k3d](https://k3d.io) cluster with [Flux](https://fluxcd.io) bootstrapped
onto it from an existing GitHub repo, and a Rancher server (in a container)
with that cluster imported as a downstream cluster.

## Prerequisites

`docker`, `k3d`, `flux`, `kubectl`, `jq`, `curl` on your `PATH`.

## Usage

```sh
cp dev/.env.example dev/.env
# edit dev/.env: at least GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO

./dev/up.sh
```

`up.sh` is safe to re-run — it only creates/bootstraps what's missing. It
starts the Rancher container, waits for it to come up, creates the k3d
cluster, runs `flux bootstrap github` against it, and registers the cluster
in Rancher. At the end it prints the exact command to start the extension's
dev server, e.g.:

```sh
API=https://localhost:8443 yarn dev
```

Log in to the Rancher UI itself at `https://localhost:8443` with
`admin` / the `RANCHER_BOOTSTRAP_PASSWORD` from your `dev/.env`.

### Pausing vs tearing down

- `./dev/stop.sh` — stops the Rancher container and the k3d cluster without
  deleting either. `./dev/up.sh` afterwards just starts them back up: no
  re-bootstrap, no re-import.
- `./dev/down.sh` — removes the Rancher container and deletes the k3d
  cluster. Rancher's data (login, settings, imported-cluster registration)
  lives in a separate named Docker volume that this does **not** remove, so
  the next `./dev/up.sh` still comes back with the same Rancher state. This
  does not touch the GitHub repo used for the Flux bootstrap; re-running
  bootstrap against it is idempotent, but if you want a totally clean slate
  there you'll need to remove the `$GITHUB_PATH` folder from that repo
  yourself.

## Troubleshooting

**Rancher's `server-url` setting vs `host.k3d.internal`**: `up.sh` sets
Rancher's `server-url` global setting to `https://host.k3d.internal:<port>`
rather than `https://localhost:<port>`. That's because `server-url` is only
used to build the manifest that the *cluster-agent pod running inside k3d*
uses to call back to Rancher — from inside the k3d cluster, `localhost`
means the pod itself, not your machine. `host.k3d.internal` is k3d's builtin
DNS name for the Docker host. Your browser and the extension's dev server
are unaffected by this setting; they keep talking to Rancher via
`https://localhost:<port>` directly.

**Windows / WSL2**: if Docker is running as Docker Desktop's WSL2 backend
(check `docker info` for `Operating System: Docker Desktop`), published
container ports are automatically forwarded to Windows' own `localhost`, so
`https://localhost:8443` opens directly from a browser on Windows with no
extra setup. If you're instead using a bare WSL2 `dockerd` with no Docker
Desktop, the same usually still works via WSL2's built-in
`localhostForwarding`, but that's worth checking first if the UI doesn't load.

**Rancher API assumptions**: `dev/lib.sh` scripts the classic `/v3/cluster`
+ `/v3/clusterregistrationtoken` import flow via `curl`/`jq`. This is a
stable, long-used part of Rancher's API, but if it ever breaks against a
newer Rancher version, you can always finish the import by hand instead:
open `https://localhost:8443` → Cluster Management → Import Existing →
Generic, and apply the kubectl command it gives you against the
`k3d-<CLUSTER_NAME>` context.
