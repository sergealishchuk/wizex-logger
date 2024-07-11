#!/bin/bash

handle_error() {
    if [ $? != 0 ]; then
    echo error happen
    exit 1
fi
}

while getopts b:l:p:e: flag
do
   case "${flag}" in
       b) branch=${OPTARG};;
       l) path=${OPTARG};;
       p) pm2name=${OPTARG};;
       #e) env=${OPTARG};;
   esac
done

echo "Start"

echo "# path $path"
cd "$path"
source .env

#cd /home/alioks/Projects/alioks-cds-develop

echo "# checkout $branch"
git checkout $branch

echo "# git pull"
git pull

echo "# npm install"
npm install

echo "# cd branch"
cd backend

echo "# npm install"
npm install

echo "# cd .."
cd ..

echo "# cd backendSocket"
cd backendSocket

echo "# npm install"
npm install

echo "# cd .."
cd ..

echo "# APP_ENV=$APP_ENV npm run build"
npm run build

#--env.APP_ENV=aliokscds_develop_global