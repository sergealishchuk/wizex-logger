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
   esac
done

echo "Start"

echo "# path $path"
cd "$path"
source .env

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

echo " - start or restart servers - "
name="$pm2name-frontend"
if [ "$(pm2 id $name)" = "[]" ]; then
  echo "not found, so we start"
  pm2 --name "$name" start 'npm run server'
else
  echo "need restart"
  pm2 restart "$name"
fi;

cd backend
name="$pm2name-backend"
if [ "$(pm2 id $name)" = "[]" ]; then
  echo "not found, so we start"
  pm2 --name "$name" start 'npm run server'
else
  echo "need restart"
  pm2 restart "$name"
fi;

cd ..
cd backendSocket
name="$pm2name-backendSocket"
if [ "$(pm2 id $name)" = "[]" ]; then
  echo "not found, so we start"
  pm2 --name "$name" start 'npm run server'
else
  echo "need restart"
  pm2 restart "$name"
fi;

cd ..
echo "Finished."
