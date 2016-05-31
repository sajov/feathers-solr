#!/bin/sh

FILE="solr-6.0.1.tgz"
URL="https://archive.apache.org/dist/lucene/solr/6.0.1/"

wget $URL$FILE
tar xfz solr-6.0.1.tgz
cd solr-6.0.1
java -version
bin/solr start -e schemaless