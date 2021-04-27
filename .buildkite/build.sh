#!/bin/bash

set -euo pipefail

cp -r /workdir /var/tmp

pushd /var/tmp/workdir
bundle install
bundle exec jekyll build
popd
