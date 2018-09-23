#!/bin/sh

docker-compose --file '/home/kundius/Projects/abcfarben/docker-compose.yml' run --rm -u $(id -u) app php "$@"

return $?