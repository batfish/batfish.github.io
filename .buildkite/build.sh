#!/bin/bash

set -euo pipefail

bundle install
bundle exec jekyll build
