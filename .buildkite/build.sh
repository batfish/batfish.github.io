#!/bin/bash

set -euo pipefail

# hack to make things writeable by bundle
touch Gemfile.lock
chmod a+w Gemfile.lock
mkdir _site
chmod a+w _site

bundle install
bundle exec jekyll build
