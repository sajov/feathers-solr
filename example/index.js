const Service = require('../lib');
const Client = require('../lib').Client;

const options = {
  Model: new Client('https://feathers.better-search-box.com/solr'),
  name: 'solr',
  paginate: {}
};

const solr = new Service(options);

console.log(solr);
console.log(solr.Model);
solr.Model.get('', { $limit: 1 }).then(res => console.log('?????', res));
solr.get('', { $limit: 1 }).then(res => console.log('?????', res));
// fetch('https://feathers.better-search-box.com/solr', options)
// fetch("https://feathers.better-search-box.com/solr?$limit=1")
//   .then(res => res.json())
//   .then(json => console.log(json));
