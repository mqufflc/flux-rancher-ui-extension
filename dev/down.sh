#!/usr/bin/env bash
set -euo pipefail

# Full teardown of the Rancher container and the k3d cluster. The Rancher
# data volume is left in place, so a subsequent `dev/up.sh` still comes back
# up with the same admin login, settings, and imported-cluster registration.

# shellcheck source=./lib.sh
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

load_env

k3d_down
rancher_down
