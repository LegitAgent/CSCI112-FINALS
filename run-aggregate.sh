#!/usr/bin/env bash

# run this with bash <filename>.sh
# run this in either git bash or in a bash terminal directly
# make sure you have mongosh installed
set -euo pipefail # return errors

cd -- "$(dirname -- "${BASH_SOURCE[0]}")" # standardize root

# check for file env
if [[ ! -f .env.local ]]; then
  echo "Copy .env.example to .env.local and fill in your credentials."
  exit 1
fi

# read through file, must be in that order
while IFS= read -r line || [[ -n "$line" ]]; do
  line="${line%$'\r'}"

  case "$line" in
    MONGODB_HOST=*) MONGODB_HOST="${line#*=}" ;;
    MONGODB_DATABASE=*) MONGODB_DATABASE="${line#*=}" ;;
    MONGODB_USERNAME=*) MONGODB_USERNAME="${line#*=}" ;;
  esac
done < .env.local

# param validate on missing vars
: "${MONGODB_HOST:?Missing MONGODB_HOST}"
: "${MONGODB_DATABASE:?Missing MONGODB_DATABASE}"
: "${MONGODB_USERNAME:?Missing MONGODB_USERNAME}"

# run query file with sh
mongosh "mongodb+srv://${MONGODB_HOST}/${MONGODB_DATABASE}" \
  --apiVersion 1 \
  --username "$MONGODB_USERNAME" \
  --authenticationDatabase admin \
  --file queries/part-e-aggregate.js