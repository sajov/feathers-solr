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

Please refer to the [feathersjs](http://docs.feathersjs.com/) for more details.

## Start Solr

```
 bin/solr start -e schemaless
``` 
Or see `feathers-solr/bin/install-solr.sh` for a kickstart installation


## Complete Example

Here's an example of a Feathers server that uses `feathers-solr`.

```js
const feathers = require('feathers');
const rest = require('feathers-rest');
const hooks = require('feathers-hooks');
const bodyParser = require('body-parser');
const errorHandler = require('feathers-errors/handler');
const plugin = require('feathers-solr');

// Initialize the application
const app = feathers()
  .configure(rest())
  .configure(hooks())
  // Needed for parsing bodies (login)
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  // Initialize your feathers plugin
  .use('/plugin', plugin())
  .use(errorHandler());

app.listen(3030);

console.log('Feathers app started on 127.0.0.1:3030');
```

## Support all default Queries
see [Feathers querying](https://docs.feathersjs.com/api/databases/querying.html)

## Supported Solr Queries

### $search
Simple query
```
query: {
  $search: "John"
}
```

More complex query with a default Solr configuration. 
```
query: {
  $search: "John !Doe age +age:[80 TO *]"
}
```
Will search for 


| Search         | Description                                                                                       |
|----------------|---------------------------------------------------------------------------------------------------|
| John           | Search in all fields. See Solr copy field `copy:* to _text_`                                      |
| !Doe           | Deny for all fields                                                                               |
| +age:[80 TO *] | Add filter age > 80. `+`will force this as an AND operation,  `[]` for $gte/$lte, `{}` for $gt/$lt|




### $facet Functions and Analytics
See [Solr Facet Functions and Analytics](http://yonik.com/solr-facet-functions/)

| Aggregation | Example | Effect |
| sum | sum(sales) | summation of numeric values |
| avg | avg(popularity) | average of numeric values |
| sumsq | sumsq(rent) | sum of squares |
| min | min(salary) | minimum value |
| max | max(mul(price,popularity)) | maximum value |
| unique | unique(state) | number of unique values (count distinct) |
| hll | hll(state) | number of unique values using the HyperLogLog algorithm |
| percentile | percentile(salary,50,75,99,99.9) | calculates percentiles |

```
query: {
    $facet: {
        age_avg : "avg(age_i)",
        age_sum : "sum(age_i)"
    }
}

```

### $facet Ranges
Add a facet type range

```
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

Result
```
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

See more query variants (JSON Facet API)[http://yonik.com/json-facet-api/],(Solr Facet Functions and Analytics)[http://yonik.com/solr-facet-functions/], (Solr Subfacets)[http://yonik.com/solr-subfacets/], (Multi-Select Faceting)[http://yonik.com/multi-select-faceting/]


### $params
This will add all kind of solr query params. This
This example will group the result.
```
query: {
    $params: {
        
        group : true,
        "group.field" : "age_i"
    }
}
```


### $suggest
will comming next

### $spellcheck
will comming next

## Changelog

__0.1.1__

- Initial release

## License

Copyright (c) 2015

Licensed under the [MIT license](LICENSE).
