#!/bin/bash -ex

TAG_VERSION=`git describe --no-abbrev 2>/dev/null`
REPO_VERSION=`npm view jest-snapshot-saga version 2>/dev/null`
LOCAL_VERSION=`node -p "require('./package.json').version"`

if [[ "$REPO_VERSION" = "$LOCAL_VERSION" ]]; then
  echo "This version is already exists"
elif [[ "$TAG_VERSION" != "v$LOCAL_VERSION" ]]; then
  echo "Tag unmatched"
else 
  npx can-npm-publish
  npm publish
fi
