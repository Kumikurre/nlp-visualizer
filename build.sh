#!/usr/bin/env bash

echo "Running ng build"
ng build --prod --output-path=./deploy

echo "Copying file to /tmp/deploy"
cp -r deploy /tmp/
