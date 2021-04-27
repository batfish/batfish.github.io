#!/usr/bin/env bash
set -euo pipefail

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
          image: jekyll/jekyll
          always-pull: true
EOF
