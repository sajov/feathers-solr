#!/bin/sh

FILE="solr-6.0.0.tgz"
URL="https://archive.apache.org/dist/lucene/solr/6.0.0/"

wget $URL$FILE
tar xfz solr-6.0.0.tgz
cd solr-6.0.0
bin/solr start -e schemaless