# feathers-solr

[![Build Status](https://travis-ci.org/sajov/feathers-solr.png?branch=feature/refactor)](https://travis-ci.org/sajov/feathers-solr)
[![Coverage Status](https://coveralls.io/repos/github/sajov/feathers-solr/badge.svg?branch=feature/refactor)](https://coveralls.io/github/sajov/feathers-solr?branch=feature/refactor)
[![dependencies Status](https://david-dm.org/sajov/feathers-solr/status.svg)](https://david-dm.org/sajov/feathers-solr)
[![Known Vulnerabilities](https://snyk.io/test/npm/feathers-solr/badge.svg)](https://snyk.io/test/npm/feathers-solr)

A [Feathers](https://feathersjs.com/) Solr Adapter.

```
$ npm install feathers-solr --save
```

> **Important:** `feathers-solr` implements the [Feathers Common database adapter API](https://docs.feathersjs.com/api/databases/common.html) and [querying syntax](https://docs.feathersjs.com/api/databases/querying.html).

Demo [eCommerce Category Page](http://feathers.better-search-box.com/)

## API

### `service([options])`

Returns a new service instance initialized with the given options.

```js
const service = require('feathers-solr');

app.use('/techproducts', service());
app.use('/techproducts', service({ id, startId, store, events, paginate }));
```

**Options:**

- `Model` (**required**) - HTTP Client (fetch, undici, or your custom).
- `name` - The name of the Solr Core / Colelction.
- `defaultParams` - This params added to all Solr request.
- `commitStrategy` - (_optional_, default: `{ softCommit: true, commitWithin: 10000,overwrite: true }`) - Define how Index changes are stored [Solr Commits](https://lucene.apache.org/solr/guide/7_7/updatehandlers-in-solrconfig.html#UpdateHandlersinSolrConfig-commitandsoftCommit).
- `schema` (_optional_) - .
- `migrate` (_optional_) - .
- `id` (_optional_, default: `'id'`) - The name of the id field property.
- `events` (_optional_) - A list of [custom service events](https://docs.feathersjs.com/api/events.html#custom-events) sent by this service
- `paginate` (_optional_) - A [pagination object](https://docs.feathersjs.com/api/databases/common.html#pagination) containing a `default` and `max` page size
- `whitelist` (_optional_) - A list of additional query parameters to allow
- `multi` (_optional_) - Allow `create` with arrays and `update` and `remove` with `id` `null` to change multiple items. Can be `true` for all methods or an array of allowed methods (e.g. `[ 'remove', 'create' ]`)

## Example

```javascript
const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const Service = require('feathers-solr');
const Client = require('feathers-solr').Client;
const app = express(feathers());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.configure(express.rest());

const options = {
  Model: new Client('http://localhost:8983/solr/techproducts'),
  core: 'techproducts',
  paginate: { default: 10, max: 100 },
  multi: true,
  events: ['testing']
};

const solr = new Service(options);
app.use('solr', solr);

app.listen(3030, () => {
  console.log(`Feathers server listening on port http://127.0.0.1:3030`);
});
```

### Install Solr

```
 bin/solr start -e techproducts
```

Use `feathers-solr/bin/install-solr.sh` for a kickstart installation.

Run the example with `node app` and go to [localhost:3030/techproducts](http://localhost:3030/techproducts).

## Querying

Additionally to the [common querying mechanism](https://docs.feathersjs.com/api/databases/querying.html) this adapter also supports special params:

## Additional Query Params

### \$search

Simple Query

```javascript
query: {
  $search: 'John';
}
```

Complex Query

```javascript
query: {
  $skip: 0,
  $limit: 50,
  $select: "id,image,name,price,special_price,categories",
  $search: "red red*",
  $facet: {
    Categories: {type: "terms", field: "categories", sort: {…}, limit: 1000, domain: {…}}
    activity: {type: "terms", field: "activity", sort: {…}, limit: 1000}
    category_gear: {type: "terms", field: "category_gear", sort: {…}, limit: 1000}
    color: {type: "terms", field: "color", sort: {…}, limit: 1000}
    eco_collection: {type: "terms", field: "eco_collection", sort: {…}, limit: 1000}
    erin_recommends: {type: "terms", field: "erin_recommends", sort: {…}, limit: 1000}
    features_bags: {type: "terms", field: "features_bags", sort: {…}, limit: 1000}
    format: {type: "terms", field: "format", sort: {…}, limit: 1000}
    gender: {type: "terms", field: "gender", sort: {…}, limit: 1000}
    material: {type: "terms", field: "material", sort: {…}, limit: 1000}
    new: {type: "terms", field: "new", sort: {…}, limit: 1000}
    performance_fabric: {type: "terms", field: "performance_fabric", sort: {…}, limit: 1000}
    price_type: {type: "terms", field: "price_type", sort: {…}, limit: 1000}
    sale: {type: "terms", field: "sale", sort: {…}, limit: 1000}
    size: {type: "terms", field: "size", sort: {…}, limit: 1000}
    strap_bags: {type: "terms", field: "strap_bags", sort: {…}, limit: 1000}
    style_bags: {type: "terms", field: "style_bags", sort: {…}, limit: 1000}
  },
  $params: {defType: "edismax", qf: "name^10 categories^5 _text_"},
  doc_type: "product"
}
```

'\$search' will try to match against Solr default search field '_text_' [Schemaless Mode](https://cwiki.apache.org/confluence/display/solr/Schemaless+Mode)

More complex query with a default Solr configuration.

```javascript
query: {

  $search: "John !Doe +age:[80 TO *]", // Search in default field _text_. See Solr copy field `copy:* to _text_`

  // Optional to optimize search relevance
  $params: {
      // define explicit fields to query and boost
      defType: "edismax",
      qf: "name^10 friends"
  }
  // or $search: "name:John^10 AND !name:Doe AND age:[80 TO *]",
  // or $search: "joh*",
  // or $search: '"john doe"',
  // or $search: 'jon~',

}
```

### \$params

Add all kind of Solr query params!
Combine huge Solr Features like _facets_, _stats_, _ranges_, _grouping_ and more with the default response.
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
        }]
    }
  }
}

```

### \$facet Functions and Analytics

See [Solr Facet Functions and Analytics](http://yonik.com/solr-facet-functions/)

| Aggregation | Example                          | Effect                                                  |
| ----------- | -------------------------------- | ------------------------------------------------------- |
| sum         | sum(sales)                       | summation of numeric values                             |
| avg         | avg(popularity)                  | average of numeric values                               |
| sumsq       | sumsq(rent)                      | sum of squares                                          |
| min         | min(salary)                      | minimum value                                           |
| max         | max(mul(price,popularity))       | maximum value                                           |
| unique      | unique(state)                    | number of unique values (count distinct)                |
| hll         | hll(state)                       | number of unique values using the HyperLogLog algorithm |
| percentile  | percentile(salary,50,75,99,99.9) | calculates percentiles                                  |

```javascript
query: {
    $facet: {
        age_avg : "avg(age)",
        age_sum : "sum(age)"
    }
}

```

### \$facet Ranges

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

### \$suggest

A custom response object for autocompleter suggestions.
See example _app.js_ for creating a custom searchcomponent and requesthandler including a spellcheck component

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

### \$spellcheck

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
http://localhost:3030/solr?$search=Handmake&color=Handmke&color="sky blue"&$limit=10&$spellcheck=1
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

## TODO

- Implement Spcial Query Params `$parms, $suggest, $facet, $populate, $highlight, $spellcheck`
- Schema
  - Validation Hook
  - Json Hook
  - Migration Hook
- Add Support for Batch Update and Patch

## Changelog

**2.2.0**

- complete refactoring
- implement @feathers/adapter-tests

## License

Copyright (c) 2015

Licensed under the [MIT license](LICENSE).
