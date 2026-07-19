#!/usr/bin/env bash
set -euo pipefail

# Pauses the dev environment without deleting anything: `dev/up.sh` will
# resume it later without re-bootstrapping Flux or re-importing the cluster.

# shellcheck source=./lib.sh
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

load_env

k3d_stop
rancher_stop
