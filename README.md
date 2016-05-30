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

Please refer to the [feathers-solr documentation](http://docs.feathersjs.com/) for more details.

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


## Changelog

__0.1.0__

- Initial release

## License

Copyright (c) 2015

Licensed under the [MIT license](LICENSE).
