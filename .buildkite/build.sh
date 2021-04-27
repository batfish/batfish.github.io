#!/bin/bash

set -euo pipefail

# cp -r /workdir /var/tmp
# pushd /var/tmp/workdir

touch Gemfile.lock
chmod a+w Gemfile.lock
mkdir _site
chmod a+w _site

bundle install
bundle exec jekyll build

#popd
