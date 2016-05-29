#!/bin/sh

FILE="solr-6.0.0.tgz"
URL="http://artfiles.org/apache.org/lucene/solr/6.0.0/"

wget $URL$FILE
tar xfz solr-6.0.0.tgz
cd solr-6.0.0
bin/solr start -e schemaless