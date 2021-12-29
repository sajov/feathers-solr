#!/bin/sh

FILE="solr-7.7.2.tgz"
URL="https://archive.apache.org/dist/lucene/solr/7.7.2/"


wget $URL$FILE
tar xfz solr-7.7.2.tgz
cd solr-7.7.2

java -version
# bin/solr start -e cloud -noprompt
# bin/solr start -e techproducts
bin/solr start
