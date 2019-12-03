# feathers-solr

[![Build Status](https://travis-ci.org/sajov/feathers-solr.png?branch=master)](https://travis-ci.org/sajov/feathers-solr)
[![Coverage Status](https://coveralls.io/repos/github/sajov/feathers-solr/badge.svg?branch=master)](https://coveralls.io/github/sajov/feathers-solr?branch=master)
[![dependencies Status](https://david-dm.org/sajov/feathers-solr/status.svg)](https://david-dm.org/sajov/feathers-solr)
[![Known Vulnerabilities](https://snyk.io/test/npm/feathers-solr/badge.svg)](https://snyk.io/test/npm/feathers-solr)
> Solr Adapter for Feathersjs. Can also used as a Solr-client. See [additional-client-methods](https://github.com/sajov/feathers-solr/blob/master/README.md#additional-client-methods)
> Require >= Solr 5.x

## Online Demo
[eCommerce Category Pages](http://feathers.better-search-box.com/)
This demonstrate ease of a single query

## Installation

```
npm install feathers-solr --save
```

## Documentation

Please refer to the [Feathers database adapter documentation](http://docs.feathersjs.com/databases/readme.html) for more details or directly at:

- [Service methods](https://docs.feathersjs.com/api/databases/common.html#service-methods) - How to use a database adapter
- [Pagination and Sorting](https://docs.feathersjs.com/api/databases/common.html#pagination) - How to use pagination and sorting for the database adapter
- [Querying](https://docs.feathersjs.com/api/databases/querying.html) - The common adapter querying mechanism
- [Extending](https://docs.feathersjs.com/api/databases/common.html#extending-adapters) - How to extend a database adapter

## Getting Started

### Install Solr

```
 bin/solr start -e schemaless
``` 

Use feathers-solr/bin/install-solr.sh for a kickstart installation.


## Options

| Option           | Default                                                    | Description                                                        |
| ---------------- | ---------------------------------------------------------- | ------------------------------------------------------------------ |
| host             | http://localhost:8983/solr                                 |                                                                    |
| core             | /gettingstarted                                            |                                                                    |
| schema           | false                                                      | {title: {type:"string"}}                                           |
| migrate          | alter                                                      | *safe*, *alter* and  *drop* (delete all data and reset schema)     |
| idfield          | 'id'                                                       | Unique Document identifier                                         |
| commitStrategy   | {softCommit: true, commitWithin: 50000, overwrite: true}   |                                                                    |
| paginate         | {default: 10, max: 100}                                    |                                                                    |


## Managed Schema
[Schemaless Mode](https://lucene.apache.org/solr/guide/6_6/schemaless-mode.html) is recommended.
Use [Solr Field Types](https://cwiki.apache.org/confluence/display/solr/Solr+Field+Types) and [Field Type Definitions and Properties](https://cwiki.apache.org/confluence/display/solr/Field+Type+Definitions+and+Properties) to define Model properties


```javascript
{
    title: {
        type: "text_general", // For more flexible searching. Default type is 'string'
        stored: true, // default, keep value visible in results
        indexed: true, // default, make it searchable
        multiValued: false, // default, true becomes an array field
    }
}
```

See your current schema definition

```
 http://localhost:8983/solr/gettingstarted/schema/
```



## Complete Example

Here's an example of a Feathers server that uses `feathers-solr`.

```javascript

    const feathers = require('feathers');
    const rest = require('feathers-rest');
    const hooks = require('feathers-hooks');
    const bodyParser = require('body-parser');
    const errorHandler = require('feathers-errors/handler');
    const solr = require('feathers-solr');

    const Service = new solr.Service({
        host: 'http://localhost:8983/solr',
        core: '/gettingstarted',
        schema:{
                name: 'text_general',
                company: 'text_general',
                email: 'text_general',
                age:  'int',
                gender: 'string',
                color: {
                    type: 'string',
                    multiValued: true,
                },
                address: {
                    type: 'string',
                    default: 'Düsseldorf'
                }
        },
        paginate: {
            default: 10,
            max: 100
    });

    const app = feathers()
      .configure(rest())
      .configure(hooks())
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({ extended: true }))
      .use('/solr', Service())
      .use(errorHandler());


    app.listen(3030);

    console.log('Feathers app started on 127.0.0.1:3030');

```


### Run Demo App

```
 node /example/app.js
```

## Support all Feathers Queries 
See [Feathers querying](https://docs.feathersjs.com/api/databases/querying.html) for more detail

## Supported Solr Queries

### $search
Simple query

```javascript
query: {
  $search: "John"
}
```

'$search' will try to match against Solr default search field '_text_' [Schemaless Mode](https://cwiki.apache.org/confluence/display/solr/Schemaless+Mode)



More complex query with a default Solr configuration. 

```javascript
query: {
  
  $search: "John !Doe +age:[80 TO *]", // Search in default field _text_. See Solr copy field `copy:* to _text_`
  // $params: {
  //   qf: "name^10 friends" define explicit fields to query and boost
  // }
  // or $search: "name:John^10 AND !name:Doe AND age:[80 TO *]", 
  // or $search: "joh*", 
  // or $search: '"john doe"', 
  // or $search: 'jon~', 
  
}
```

### $params
Add all kind of Solr query params! 
Combine huge Solr Features like *facets*, *stats*, *ranges*, *grouping* and more with the default response.
This example will group the result.

```javascript
query: {
    $params: {
        group : true,
        "group.field" : "country",
        "group.format" : "simple",
    }
}
```

Feathers Rest query

```
http://localhost:3030/solr?$params[group]=true&$params[group.field]=gender&$params[group.field]=age&$params[group.limit]=1&$params[group.format]=grouped&$select=id,age,gender
```

Feathers Result

```javascript
{
  "QTime": 0,
  "total": 0,
  "limit": 10,
  "skip": 0,
  "data": {
    "gender": {
      "matches": 50,
      "groups": [
        {
          "groupValue": "male",
          "doclist": {
            "numFound": 24,
            "start": 0,
            "docs": [
              {
                "id": "59501959f2786e0207a8b29f",
                "age": "45",
                "gender": "male"
              }
            ]
          }
        },
        {
          "groupValue": "female",
          "doclist": {
            "numFound": 26,
            "start": 0,
            "docs": [
              {
                "id": "595019590a8632fecd292592",
                "age": "51",
                "gender": "female"
              }
            ]
          }
        }
      ]
    },
    "age": {
      "matches": 50,
      "groups": [
        {
          "groupValue": "45",
          "doclist": {
            "numFound": 3,
            "start": 0,
            "docs": [
              {
                "id": "59501959f2786e0207a8b29f",
                "age": "45",
                "gender": "male"
              }
            ]
          }
        },
        {
          "groupValue": "51",
          "doclist": {
            "numFound": 2,
            "start": 0,
            "docs": [
              {
                "id": "595019590a8632fecd292592",
                "age": "51",
                "gender": "female"
              }
            ]
          }
        }
      ]
    }
  }
}

```


### $facet Functions and Analytics
See [Solr Facet Functions and Analytics](http://yonik.com/solr-facet-functions/)

|Aggregation|Example|Effect|
|--- |--- |--- |
|sum|sum(sales)|summation of numeric values|
|avg|avg(popularity)|average of numeric values|
|sumsq|sumsq(rent)|sum of squares|
|min|min(salary)|minimum value|
|max|max(mul(price,popularity))|maximum value|
|unique|unique(state)|number of unique values (count distinct)|
|hll|hll(state)|number of unique values using the HyperLogLog algorithm|
|percentile|percentile(salary,50,75,99,99.9)|calculates percentiles|


```javascript
query: {
    $facet: {
        age_avg : "avg(age)",
        age_sum : "sum(age)"
    }
}

```

### $facet Ranges
Add a facet type range

```javascript
query: {
    $facet: {
        age_ranges: {
            type: "range",
            field: "age",
            start: 0,
            end: 100,
            gap: 25
        }
    }
}
```

Feathers Rest query

```
http://localhost:3030/solr?&$facet[age_ranges][type]=range&$facet[age_ranges][field]=age&$facet[age_ranges][start]=0&$facet[age_ranges][end]=100&$facet[age_ranges][gap]=25&$facet[age_avg]=avg(age)&$facet[age_sum]=sum(age)
```

Feathers Result

```javascript
{
    QTime: 0,
    total: 50,
    limit: 10,
    skip: 0,
    data: [...],
    facet: {
        age_avg: 29.44,
        age_sum: 1472,
        count: 54,
        age_ranges: {
            buckets: [{
                val: 0,
                count: 4
            }, {
                val: 25,
                count: 17
            }, {
                val: 50,
                count: 15
            }, {
                val: 75,
                count: 14
            }]
        }
    }
}

```

See more query variants [JSON Facet API](http://yonik.com/json-facet-api/),[Solr Facet Functions and Analytics](http://yonik.com/solr-facet-functions/), [Solr Subfacets](http://yonik.com/solr-subfacets/), [Multi-Select Faceting](http://yonik.com/multi-select-faceting/)



### $suggest
A custom response object for autocompleter suggestions.
See example *app.js* for creating a custom searchcomponent and requesthandler including a spellcheck component
```
query: {
    $suggest: 'Handmake',
    $params: {} // to plain solr parameter
}
```

Feathers Rest query

```
http://localhost:3030/solr?&$suggest=Handmake
```

Feathers Result 
This is a plain solr response

```javascript
{
    {
        "responseHeader": {
            "status": 0,
            "QTime": 1
        },
        "spellcheck": {
            "suggestions": [
                "handmake", {
                    "numFound": 1,
                    "startOffset": 0,
                    "endOffset": 8,
                    "origFreq": 0,
                    "suggestion": [{
                        "word": "handmade",
                        "freq": 1
                    }]
                }
            ],
            "correctlySpelled": false,
            "collations": [
                "collation",
                "handmade"
            ]
        },
        "suggest": {
            "suggest": {
                "Handmake": {
                    "numFound": 1,
                    "suggestions": [{
                        "term": "Handmade Wooden Keyboard",
                        "weight": 0,
                        "payload": ""
                    }]
                }
            }
        }
    }
}

```

### $spellcheck
This feature add a spellcheck component to the default find result
```
query: {
    $search: "Handmake",
    $spellcheck:1,
    color: "sky blue",
    $limit: 10,

}
```

Feathers Rest query

```
http://localhost:3030/solr?$search=Handmake&color=Handmke&color="sky blue"&$limit=10&$spellcheck
```

Feathers Result 
```javascript
{
    "QTime": 0,
    "total": 6,
    "limit": 10,
    "skip": 0,
    "data": [...],
    "spellcheck": {
            "suggestions": [
                "handmake", {
                    "numFound": 1,
                    "startOffset": 0,
                    "endOffset": 8,
                    "origFreq": 0,
                    "suggestion": [{
                        "word": "handmade",
                        "freq": 1
                    }]
                }
            ],
            "correctlySpelled": false,
            "collations": [
                "collation",
                "handmade"
            ]
        },
```

### Adapter.patch

Support simple usage [Feathers Docs](https://docs.feathersjs.com/api/services.html#patchid-data-params) 

```
data: {views: 1};
Adapter.patch(id, data, params);
```

Support also advanced Solr Atomic Field Update [Solr Docs](https://lucene.apache.org/solr/guide/6_6/updating-parts-of-documents.html) 

```
data: {views: {inc:1}}; // inc, set, add, remove, removeregex
Adapter.patch(id, data, params);
```
 


| ------

## Additional Client Methods


| Solr Api's                                                                                                                                                     | Returns a Promise                                  | ./client/requestHandler/  |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------  | -------------------------------------------------- | ------------------------- |
| Ping                                                                                                                                                           | Adapter.client().ping()                            | Ping.js                   |
| [JSON Request API](https://cwiki.apache.org/confluence/display/solr/JSON+Request+API)                                                                          | Used by Adapter .find() .get()                     | JsonRequestApi.js         |
| [Update](https://cwiki.apache.org/confluence/display/solr/Uploading+Data+with+Index+Handlers#UploadingDatawithIndexHandlers-UpdateRequestHandlerConfiguration) | Used by Adapter .create(), .update() and  .patch() | UpdateRequestHandlers.js  |
| [SearchHandlers]()                                                                                                                                             | Adapter.client().search()                          | SearchHandlers.js         |
| [Schema API](https://cwiki.apache.org/confluence/display/solr/Managed+Resources)                                                                               | Adapter.client().schema.method                     | SchemaApi.js              |
| [Config API](https://cwiki.apache.org/confluence/display/solr/Config+API#ConfigAPI-CreatingandUpdatingRequestHandlers)                                         |                                                    | ConfigApi.js              |
| [CoreAdmin API](https://cwiki.apache.org/confluence/display/solr/CoreAdmin+API)                                                                                | Adapter.client().coreAdmin.method                  | CoreAdminApi.js           |
| [Solr ConfigSets API](https://cwiki.apache.org/confluence/display/solr/ConfigSets+API)                                                                         | Adapter.client().configSets.method                 | ConfigSetsApi.js          |
| [Solr Collections API](https://cwiki.apache.org/confluence/display/solr/Collections+API)                                                                       | Adapter.client().collections.method                | CollectionsApi.js         |
| [Solr Managed Resources](https://cwiki.apache.org/confluence/display/solr/Managed+Resources)                                                                   | Adapter.client().resources.method                  | ManagedResources.js       |
| [Request Parameters API](https://cwiki.apache.org/confluence/display/solr/Request+Parameters+API)                                                              | Adapter.client().requestParameters.method          | RequestParametersAPI.js   |
| ~~[Parallel SQL Interface](https://cwiki.apache.org/confluence/display/solr/Parallel+SQL+Interface)~~                                                          |                                                    | ParalellSQL.js            |
| ~~[ReplicationHandlers](ReplicationHandlers)~~                                                                                                                 |                                                    | ReplicationHandlers.js    |
| ~~[RealTime Get](https://cwiki.apache.org/confluence/display/solr/RealTime+Get)~~                                                                              |                                                    | RealTime.js               |
| ~~[ShardHandlers](https://cwiki.apache.org/confluence/display/solr/RequestHandlers+and+SearchComponents+in+SolrConfig)~~                                       |                                                    | ShardHandlers.js          |
| ~~[Solr BolbStore API](https://cwiki.apache.org/confluence/display/solr/Blob+Store+API)~~                                                                      |                                                    | BlobStoreApi.js           |

Not all Solr API's implemented at the moment

## TODO
* Write more Tests
* Write more Docs
* Implement Parallel SQL Interface
* Implement ReplicationHandlers
* Implement RealTime Get
* Implement ShardHandlers
* Implement Solr BolbStore API

## Changelog

__1.1.15__
- add support $between param
- add support for auth

__1.1.14__
- ...

__1.1.13__
- refactor describe
- refactor define
- add schema tests
- edit docs

__1.1.12__
- refactor patch method


...

## License

Copyright (c) 2015

Licensed under the [MIT license](LICENSE).
