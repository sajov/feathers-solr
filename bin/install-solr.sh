#!/bin/sh

FILE="solr-7.4.0.tgz"
URL="https://archive.apache.org/dist/lucene/solr/7.4.0/"


wget $URL$FILE
tar xfz solr-7.4.0.tgz
cd solr-7.4.0

java -version
bin/solr start -e schemaless