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
        b) branch=${OPTARG};;
        l) path=${OPTARG};;
        p) pm2name=${OPTARG};;
    esac
done

echo "Start"
cd "$path"
git checkout "$branch"
git pull
#npm install
#npm run build

cd backend
npm install

cd ..
cd backendSocket
npm install

#pm2 restart "$pm2name-front"
#pm2 restart "$pm2name-backendSocket"
#pm2 restart "$pm2name-backend"
