#!/bin/sh

FILE="solr-5.0.0.tgz"
URL="https://archive.apache.org/dist/lucene/solr/5.0.0/"

wget $URL$FILE
tar xfz solr-5.0.0.tgz
cd solr-5.0.0
java -version
bin/solr start -e schemaless