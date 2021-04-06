/**
 * Parallel SQL Interface
 * https://cwiki.apache.org/confluence/display/solr/Parallel+SQL+Interface
  curl --data-urlencode 'stmt=SELECT id, title FROM gettingstarted  LIMIT 10' http://localhost:8983/solr/gettingstarted/sql
  curl --data-urlencode 'stmt=SELECT to, count(*) FROM gettingstarted GROUP BY to ORDER BY count(*) desc LIMIT 10' http://localhost:8983/solr/gettingstarted/sql?aggregationMode=facet
 */
"use strict";