#!/usr/bin/env bash

# run this with bash <filename>.sh if windows
# run this in either git bash or in a bash terminal directly
# make sure you have mongosh installed
set -euo pipefail # return errors

cd -- "$(dirname -- "${BASH_SOURCE[0]}")" # standardize root

# check for file env
if [[ ! -f .env.local ]]; then
  echo "Copy .env.example to .env.local and fill in your credentials."
  exit 1
fi

# Read KEY=value entries without executing the file their order does not matter
while IFS= read -r line || [[ -n "$line" ]]; do
  line="${line%$'\r'}"

  case "$line" in
    MONGODB_HOST=*) MONGODB_HOST="${line#*=}" ;;
    MONGODB_DATABASE=*) MONGODB_DATABASE="${line#*=}" ;;
    MONGODB_USERNAME=*) MONGODB_USERNAME="${line#*=}" ;;
    MONGODB_PASSWORD=*) MONGODB_PASSWORD="${line#*=}" ;;
  esac
done < .env.local

# param validate on missing vars
: "${MONGODB_HOST:?Missing MONGODB_HOST}"
: "${MONGODB_DATABASE:?Missing MONGODB_DATABASE}"
: "${MONGODB_USERNAME:?Missing MONGODB_USERNAME}"
: "${MONGODB_PASSWORD:?Missing MONGODB_PASSWORD}"

# run query file with sh
mongosh "mongodb+srv://${MONGODB_HOST}/${MONGODB_DATABASE}" \
  --apiVersion 1 \
  --username "$MONGODB_USERNAME" \
  --password "$MONGODB_PASSWORD" \
  --authenticationDatabase admin \
  --file queries/part-c-crud.js
