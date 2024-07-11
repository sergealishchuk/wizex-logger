#!/bin/bash

handle_error() {
    if [ $? != 0 ]; then
    echo error happen
    exit 1
fi
}

while getopts b:l:p: flag
do
    case "${flag}" in
        p) pm2name=${OPTARG};;
    esac
done

pm2 restart "$pm2name-front"
pm2 restart "$pm2name-backendSocket"
pm2 restart "$pm2name-backend"
