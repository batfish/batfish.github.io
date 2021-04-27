#!/usr/bin/env bash
set -euo pipefail

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
EOF
