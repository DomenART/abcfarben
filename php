#!/bin/sh

docker-compose --file '/home/kundius/Desktop/Projects/abcfarben/docker-compose.yml' run --rm -u $(id -u) app php "$@"

return $?