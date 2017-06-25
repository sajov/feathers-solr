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


### $facet
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
Result
```
{
    QTime: 0,
    total: 50,
    limit: 10,
    skip: 0,
    data: [...],
    facet: {
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
