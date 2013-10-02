#!/bin/sh

cd /var/www/admin/data/www/handika.net/
git pull origin master

cd static/
grunt build
