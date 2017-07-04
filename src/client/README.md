## Classes

<dl>
<dt><a href="#Schema">Schema</a></dt>
<dd><p>Schema API</p>
</dd>
</dl>

## Members

<dl>
<dt><a href="#CollectionsApi">CollectionsApi</a></dt>
<dd><p>Solr Collections API
<a href="https://cwiki.apache.org/confluence/display/solr/Collections+API">https://cwiki.apache.org/confluence/display/solr/Collections+API</a></p>
</dd>
<dt><a href="#ConfigSets">ConfigSets</a></dt>
<dd><p>Solr ConfigSets API
<a href="https://cwiki.apache.org/confluence/display/solr/ConfigSets+API">https://cwiki.apache.org/confluence/display/solr/ConfigSets+API</a></p>
</dd>
<dt><a href="#CoreAdminApi">CoreAdminApi</a></dt>
<dd><p>CoreAdmin API
<a href="https://cwiki.apache.org/confluence/display/solr/CoreAdmin+API">https://cwiki.apache.org/confluence/display/solr/CoreAdmin+API</a></p>
</dd>
<dt><a href="#ManagedResources">ManagedResources</a></dt>
<dd><p>Solr Managed Resources
<a href="https://cwiki.apache.org/confluence/display/solr/Managed+Resources">https://cwiki.apache.org/confluence/display/solr/Managed+Resources</a></p>
</dd>
<dt><a href="#RequestParameters">RequestParameters</a></dt>
<dd><p>Request Parameters API
<a href="https://cwiki.apache.org/confluence/display/solr/Request+Parameters+API">https://cwiki.apache.org/confluence/display/solr/Request+Parameters+API</a></p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#someMethod">someMethod()</a></dt>
<dd><p>Solr BolbStore API
<a href="https://cwiki.apache.org/confluence/display/solr/Blob+Store+API">https://cwiki.apache.org/confluence/display/solr/Blob+Store+API</a></p>
</dd>
<dt><a href="#default">default()</a></dt>
<dd><p>Solr Config API
<a href="https://cwiki.apache.org/confluence/display/solr/Config+API#ConfigAPI-CreatingandUpdatingRequestHandlers">https://cwiki.apache.org/confluence/display/solr/Config+API#ConfigAPI-CreatingandUpdatingRequestHandlers</a>
<a href="https://cwiki.apache.org/confluence/display/solr/RequestHandlers+and+SearchComponents+in+SolrConfig">https://cwiki.apache.org/confluence/display/solr/RequestHandlers+and+SearchComponents+in+SolrConfig</a></p>
</dd>
<dt><a href="#default">default()</a></dt>
<dd><p>JSON Request API
<a href="https://cwiki.apache.org/confluence/display/solr/JSON+Request+API">https://cwiki.apache.org/confluence/display/solr/JSON+Request+API</a>
<a href="http://yonik.com/solr-json-request-api/">http://yonik.com/solr-json-request-api/</a>
 curl <a href="http://localhost:8983/solr/gettingstarted/query">http://localhost:8983/solr/gettingstarted/query</a> -d &#39;
 {
   &quot;query&quot; : &quot;<em>:</em>&quot;,
   &quot;filter&quot; : &quot;id:222&quot;
 }&#39;</p>
<p> body: {
     query: &#39;<em>:</em>&#39;,
     filter : &#39;id:222&#39;</p>
<p> },</p>
<p>curl <a href="http://localhost:8983/solr/gettingstarted/query">http://localhost:8983/solr/gettingstarted/query</a> -d &#39;
{
  query:&quot;doc&quot;
}&#39;</p>
<p>curl <a href="http://localhost:8983/solr/gettingstarted/query">http://localhost:8983/solr/gettingstarted/query</a> -d &#39;
{
    query:&quot;<em>:</em>&quot;,
    limit:&quot;10&quot;,
    offset:&quot;0&quot;,
    sort:&quot;<em>version</em> desc&quot;,
    fields:&quot;*&quot;
 }&#39;</p>
</dd>
<dt><a href="#default">default()</a></dt>
<dd><p>Solr Config API</p>
<p><a href="http://localhost:8983/solr/gettingstarted/admin/ping?wt=json">http://localhost:8983/solr/gettingstarted/admin/ping?wt=json</a>
<a href="https://cwiki.apache.org/confluence/display/solr/RequestHandlers+and+SearchComponents+in+SolrConfig">https://cwiki.apache.org/confluence/display/solr/RequestHandlers+and+SearchComponents+in+SolrConfig</a></p>
</dd>
<dt><a href="#someMethod">someMethod()</a></dt>
<dd><p>Solr Config API
<a href="https://cwiki.apache.org/confluence/display/solr/RequestHandlers+and+SearchComponents+in+SolrConfig">https://cwiki.apache.org/confluence/display/solr/RequestHandlers+and+SearchComponents+in+SolrConfig</a></p>
</dd>
<dt><a href="#someMethod">someMethod()</a></dt>
<dd><p>Solr Config API
<a href="https://cwiki.apache.org/confluence/display/solr/RequestHandlers+and+SearchComponents+in+SolrConfig">https://cwiki.apache.org/confluence/display/solr/RequestHandlers+and+SearchComponents+in+SolrConfig</a></p>
</dd>
<dt><a href="#Constructor">Constructor(request, opts)</a> ⇒ <code>object</code></dt>
<dd></dd>
<dt><a href="#Req request method">Req request method(opts)</a> ⇒ <code>object</code></dt>
<dd></dd>
<dt><a href="#default">default()</a></dt>
<dd><p>Solr Config API
<a href="https://cwiki.apache.org/confluence/display/solr/RequestHandlers+and+SearchComponents+in+SolrConfig">https://cwiki.apache.org/confluence/display/solr/RequestHandlers+and+SearchComponents+in+SolrConfig</a></p>
</dd>
<dt><a href="#someMethod">someMethod()</a></dt>
<dd><p>Solr Config API
<a href="https://cwiki.apache.org/confluence/display/solr/RequestHandlers+and+SearchComponents+in+SolrConfig">https://cwiki.apache.org/confluence/display/solr/RequestHandlers+and+SearchComponents+in+SolrConfig</a></p>
</dd>
<dt><a href="#Suggest">Suggest(request, opts, query)</a> ⇒ <code>object</code></dt>
<dd><p>Solr Suggester</p>
</dd>
<dt><a href="#update">update()</a></dt>
<dd><p>Solr Config API
<a href="https://cwiki.apache.org/confluence/display/solr/Uploading+Data+with+Index+Handlers#UploadingDatawithIndexHandlers-JSONFormattedIndexUpdates">https://cwiki.apache.org/confluence/display/solr/Uploading+Data+with+Index+Handlers#UploadingDatawithIndexHandlers-JSONFormattedIndexUpdates</a></p>
<p> curl -X POST -H &#39;Content-Type: application/json&#39; &#39;<a href="http://localhost:8983/solr/my_collection/update">http://localhost:8983/solr/my_collection/update</a>&#39; --data-binary &#39;
 {
   &quot;add&quot;: {
     &quot;doc&quot;: {
       &quot;id&quot;: &quot;DOC1&quot;,
       &quot;my_boosted_field&quot;: {        // use a map with boost/value for a boosted field //
         &quot;boost&quot;: 2.3,
         &quot;value&quot;: &quot;test&quot;
       },
       &quot;my_multivalued_field&quot;: [ &quot;aaa&quot;, &quot;bbb&quot; ]   // Can use an array for a multi-valued field //
     }
   },
   &quot;add&quot;: {
     &quot;commitWithin&quot;: 5000,          // commit this document within 5 seconds //
     &quot;overwrite&quot;: false,            // don&#39;t check for existing documents with the same uniqueKey //
     &quot;boost&quot;: 3.45,                 // a document boost //
     &quot;doc&quot;: {
       &quot;f1&quot;: &quot;v1&quot;,                  // Can use repeated keys for a multi-valued field //
       &quot;f1&quot;: &quot;v2&quot;
     }
   },</p>
<p>   &quot;commit&quot;: {},
   &quot;optimize&quot;: { &quot;waitSearcher&quot;:false },</p>
<p>   &quot;delete&quot;: { &quot;id&quot;:&quot;ID&quot; },         // delete by ID
   &quot;delete&quot;: { &quot;query&quot;:&quot;QUERY&quot; }    // delete by query
 }&#39;</p>
</dd>
</dl>

<a name="Schema"></a>

## Schema
Schema API

**Kind**: global class
<a name="CollectionsApi"></a>

## CollectionsApi
Solr Collections API
https://cwiki.apache.org/confluence/display/solr/Collections+API

**Kind**: global variable
<a name="ConfigSets"></a>

## ConfigSets
Solr ConfigSets API
https://cwiki.apache.org/confluence/display/solr/ConfigSets+API

**Kind**: global variable
<a name="CoreAdminApi"></a>

## CoreAdminApi
CoreAdmin API
https://cwiki.apache.org/confluence/display/solr/CoreAdmin+API

**Kind**: global variable
<a name="ManagedResources"></a>

## ManagedResources
Solr Managed Resources
https://cwiki.apache.org/confluence/display/solr/Managed+Resources

**Kind**: global variable
<a name="RequestParameters"></a>

## RequestParameters
Request Parameters API
https://cwiki.apache.org/confluence/display/solr/Request+Parameters+API

**Kind**: global variable
<a name="someMethod"></a>

## someMethod()
Solr BolbStore API
https://cwiki.apache.org/confluence/display/solr/Blob+Store+API

**Kind**: global function
<a name="default"></a>

## default()
Solr Config API
https://cwiki.apache.org/confluence/display/solr/Config+API#ConfigAPI-CreatingandUpdatingRequestHandlers
https://cwiki.apache.org/confluence/display/solr/RequestHandlers+and+SearchComponents+in+SolrConfig

**Kind**: global function
<a name="default"></a>

## default()
JSON Request API
https://cwiki.apache.org/confluence/display/solr/JSON+Request+API
http://yonik.com/solr-json-request-api/
 curl http://localhost:8983/solr/gettingstarted/query -d '
 {
   "query" : "*:*",
   "filter" : "id:222"
 }'

 body: {
     query: '*:*',
     filter : 'id:222'

 },

curl http://localhost:8983/solr/gettingstarted/query -d '
{
  query:"doc"
}'


curl http://localhost:8983/solr/gettingstarted/query -d '
{
    query:"*:*",
    limit:"10",
    offset:"0",
    sort:"_version_ desc",
    fields:"*"
 }'

**Kind**: global function
<a name="default"></a>

## default()
Solr Config API

http://localhost:8983/solr/gettingstarted/admin/ping?wt=json
https://cwiki.apache.org/confluence/display/solr/RequestHandlers+and+SearchComponents+in+SolrConfig

**Kind**: global function
<a name="someMethod"></a>

## someMethod()
Solr Config API
https://cwiki.apache.org/confluence/display/solr/RequestHandlers+and+SearchComponents+in+SolrConfig

**Kind**: global function
<a name="someMethod"></a>

## someMethod()
Solr Config API
https://cwiki.apache.org/confluence/display/solr/RequestHandlers+and+SearchComponents+in+SolrConfig

**Kind**: global function
<a name="Constructor"></a>

## Constructor(request, opts) ⇒ <code>object</code>
**Kind**: global function
**Returns**: <code>object</code> - Promise

| Param | Type | Description |
| --- | --- | --- |
| request | <code>object</code> | Request |
| opts | <code>object</code> | Default Request params |

<a name="Req request method"></a>

## Req request method(opts) ⇒ <code>object</code>
**Kind**: global function
**Returns**: <code>object</code> - Returns a Promise

| Param | Type | Description |
| --- | --- | --- |
| opts | <code>object</code> | Options |

<a name="default"></a>

## default()
Solr Config API
https://cwiki.apache.org/confluence/display/solr/RequestHandlers+and+SearchComponents+in+SolrConfig

**Kind**: global function
<a name="someMethod"></a>

## someMethod()
Solr Config API
https://cwiki.apache.org/confluence/display/solr/RequestHandlers+and+SearchComponents+in+SolrConfig

**Kind**: global function
<a name="Suggest"></a>

## Suggest(request, opts, query) ⇒ <code>object</code>
Solr Suggester

**Kind**: global function
**Returns**: <code>object</code> - Promise

| Param | Type | Description |
| --- | --- | --- |
| request | <code>object</code> | Request |
| opts | <code>object</code> | Options |
| query | <code>object</code> | Query |

<a name="update"></a>

## update()
Solr Config API
https://cwiki.apache.org/confluence/display/solr/Uploading+Data+with+Index+Handlers#UploadingDatawithIndexHandlers-JSONFormattedIndexUpdates

 curl -X POST -H 'Content-Type: application/json' 'http://localhost:8983/solr/my_collection/update' --data-binary '
 {
   "add": {
     "doc": {
       "id": "DOC1",
       "my_boosted_field": {        // use a map with boost/value for a boosted field //
         "boost": 2.3,
         "value": "test"
       },
       "my_multivalued_field": [ "aaa", "bbb" ]   // Can use an array for a multi-valued field //
     }
   },
   "add": {
     "commitWithin": 5000,          // commit this document within 5 seconds //
     "overwrite": false,            // don't check for existing documents with the same uniqueKey //
     "boost": 3.45,                 // a document boost //
     "doc": {
       "f1": "v1",                  // Can use repeated keys for a multi-valued field //
       "f1": "v2"
     }
   },

   "commit": {},
   "optimize": { "waitSearcher":false },

   "delete": { "id":"ID" },         // delete by ID
   "delete": { "query":"QUERY" }    // delete by query
 }'

**Kind**: global function