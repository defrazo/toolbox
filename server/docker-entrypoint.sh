#!/bin/sh
set -e

cd /var/www/html

if [ -z "${APP_KEY:-}" ]; then
    echo "ERROR: APP_KEY is not configured" >&2
    exit 1
fi

if [ ! -f public/index.php ]; then
    cp -a /var/www/html-public-src/. public/
fi

exec "$@"