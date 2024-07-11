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
   esac
done

echo "Start"

echo "# path $path"
cd "$path"
source .env

echo "# checkout $branch"
git checkout $branch

echo "# git add ."
git add .

echo "# git commit --allow-empty -m 'Empty Commit'"
git commit --allow-empty -m "Empty Commit"

echo "# git push"
git push
