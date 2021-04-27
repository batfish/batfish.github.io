#!/bin/bash

set -euo pipefail

# cp -r /workdir /var/tmp
# pushd /var/tmp/workdir

touch Gemfile.lock
chmod a+w Gemfile.lock
bundle install
bundle exec jekyll build

#popd
