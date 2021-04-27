#!/usr/bin/env bash
set -euo pipefail

BATFISH_DOCKER_CI_BASE_IMAGE="${BATFISH_DOCKER_CI_BASE_IMAGE:-batfish/ci-base:latest}"
DOCKER_PLUGIN_VERSION="${DOCKER_PLUGIN_VERSION:-v3.3.0}"

cat <<EOF
steps:
EOF

###### WAIT a visible marker between pipeline generation and starting.
cat <<EOF
  - wait
EOF

cat <<EOF
  - label: ":jekyll: jekyll"
    command:
      - ".buildkite/build.sh"
    plugins:
      - docker#${DOCKER_PLUGIN_VERSION}:
          image: "${BATFISH_DOCKER_CI_BASE_IMAGE}"
          always-pull: true
EOF
