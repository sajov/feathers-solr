# feathers-solr

[![Build Status](https://travis-ci.org/sajov/feathers-solr.png?branch=master)](https://travis-ci.org/sajov/feathers-solr)
[![Coverage Status](https://coveralls.io/repos/github/sajov/feathers-solr/badge.svg?branch=master)](https://coveralls.io/github/sajov/feathers-solr?branch=master)
[![Dependency Status](https://david-dm.org/sajov/feathers-solr.svg)](https://david-dm.org/jsdoc2md/feathers-solr)

> Solr Adapter for Feathersjs

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

#### Install Solr

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
| commitStrategy   | {softCommit: true, commitWithin: 50000, overwrite: true}   |                                                                    |


### Schema
[Schemaless Mode](https://lucene.apache.org/solr/guide/6_6/schemaless-mode.html) is recommended.
Use [Solr Field Types](https://cwiki.apache.org/confluence/display/solr/Solr+Field+Types) and [Field Type Definitions and Properties](https://cwiki.apache.org/confluence/display/solr/Field+Type+Definitions+and+Properties) to define Model properties


```javascript
{
    title: {
        type: "text_general", // For more flexible searching. Default type is 'string'
        stored: true, // default, keep value visible in results
        indexed: true, // default, make it searchable
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

    const Service = feathersSolr({
        host: 'http://localhost:8983/solr',
        core: '/gettingstarted',
        schema:{
            title: {
                type: 'text_general'
            },
            desciption: {
                type: 'text_general'
            }
        },
        paginate: {
            default: 10,
            max: 4
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
  // or $search: '"john doe"', 
  // or $search: 'jon', 
  
}
```

### $params
To add all kind of Solr query params!
This example will group the result.

```javascript
query: {
    $params: {
        group : true,
        "group.field" : "country"
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
        age_avg : "avg(age_i)",
        age_sum : "sum(age_i)"
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
http://localhost:3030/solr?&$facet[age_ranges][type]=range&$facet[age_ranges][field]=age&$facet[age_ranges][start]=0&$facet[age_ranges][end]=100&$facet[age_ranges][gap]=25&$facet[age_avg]=avg(age_i)&$facet[age_sum]=sum(age_i)
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
will comming next

### $spellcheck
will comming next


## Adittional Client Methods


| Solr Api's                                                                                                                                                     | Returns a Promise                                  | ./client/requestHandler/  |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------  | -------------------------------------------------- | ------------------------- |
| ~~[Solr BolbStore API](https://cwiki.apache.org/confluence/display/solr/Blob+Store+API)~~                                                                      |                                                    | BlobStoreApi.js           |
| [Solr Collections API](https://cwiki.apache.org/confluence/display/solr/Collections+API)                                                                       | Adapter.client().collections.method                | CollectionsApi.js         |
| ~~[Config API](https://cwiki.apache.org/confluence/display/solr/Config+API#ConfigAPI-CreatingandUpdatingRequestHandlers)~~                                     |                                                    | ConfigApi.js              |
| [Solr ConfigSets API](https://cwiki.apache.org/confluence/display/solr/ConfigSets+API)                                                                         | Adapter.client().configSets.method                 | ConfigSetsApi.js          |
| [CoreAdmin API](https://cwiki.apache.org/confluence/display/solr/CoreAdmin+API)                                                                                | Adapter.client().coreAdmin.method                  | CoreAdminApi.js           |
| [JSON Request API](https://cwiki.apache.org/confluence/display/solr/JSON+Request+API)                                                                          | Used by Adapter .find() .get()                     | JsonRequestApi.js         |
| [Solr Managed Resources](https://cwiki.apache.org/confluence/display/solr/Managed+Resources)                                                                   | Adapter.client().resources.method                  | ManagedResources.js       |
| ~~[Parallel SQL Interface](https://cwiki.apache.org/confluence/display/solr/Parallel+SQL+Interface)~~                                                          |                                                    | ParalellSQL.js            |
| Ping                                                                                                                                                           | Adapter.client().ping()                            | Ping.js                   |
| ~~[RealTime Get](https://cwiki.apache.org/confluence/display/solr/RealTime+Get)~~                                                                              |                                                    | RealTime.js               |
| ~~[ReplicationHandlers](ReplicationHandlers)~~                                                                                                                 |                                                    | ReplicationHandlers.js    |
| [Request Parameters API](https://cwiki.apache.org/confluence/display/solr/Request+Parameters+API)                                                              | Adapter.client().requestParameters.method          | RequestParametersAPI.js   |
| [Schema API](https://cwiki.apache.org/confluence/display/solr/Managed+Resources)                                                                               | Adapter.client().schema.method                     | SchemaApi.js              |
| [SearchHandlers]()                                                                                                                                             | Adapter.client().search()                          | SearchHandlers.js         |
| ~~[ShardHandlers](https://cwiki.apache.org/confluence/display/solr/RequestHandlers+and+SearchComponents+in+SolrConfig)~~                                       |                                                    | ShardHandlers.js          |
| [Update](https://cwiki.apache.org/confluence/display/solr/Uploading+Data+with+Index+Handlers#UploadingDatawithIndexHandlers-UpdateRequestHandlerConfiguration) | Used by Adapter .create(), .update() and  .patch() | UpdateRequestHandlers.js  |

Not all Solr API's implemented at the moment

## TODO
* Write more tests
* Implement $suggest and $spellcheck
* Demo search page with autocompleter with suggestions. Search result with facet navigation, filter(ranges, sliders), pagination and result listing by just one query.


## Changelog

__0.1.1__

- Initial release

## License

Copyright (c) 2015

Licensed under the [MIT license](LICENSE).
