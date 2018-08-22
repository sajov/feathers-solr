const feathers = require('feathers');
const rest = require('feathers-rest');
const hooks = require('feathers-hooks');
const bodyParser = require('body-parser');
const errorHandler = require('feathers-errors/handler');
const feathersSolr = require('../lib/index');
const socketio = require('feathers-socketio');
const fakerData = require('./data/faker');
const util = require('util')
// Initialize the application
const app = feathers()
    .configure(rest())
    .configure(socketio())
    .configure(hooks())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use('/', feathers.static('./example/public'));


// Initialize your feathers plugin
const Service = feathersSolr({
    host: 'http://localhost:8983/solr',
    core: '/suggest',
    migrate: 'drop',
    paginate: {
        default: 10,
        max: 4
    }
});

app.use('/solr', Service);

app.service('solr').remove(null, {})
    .then(res => {
        app.service('solr').define({
                sku: 'text_general',
                name: 'text_general',
                doc_type: 'string',
                product_type: 'string',
                parent: 'string',
                categories:  {
                    type: 'descendent_path',
                    multiValued: true,
                },
                description: 'text_general',
                special_price: 'float',
                price: 'float',
                image: 'string',
                additional_images: {
                    type: 'string',
                    multiValued: true,
                },
                additional_attributes: {
                    type: 'string',
                    multiValued: true,
                },
                url: 'string',

                createdAt: 'date',
                updatedAt: 'date',
                activity: {
                    type: 'string',
                    multiValued: true,
                },
                erin_recommends: {
                    type: 'string',
                    multiValued: true,
                },
                features_bags: {
                    type: 'string',
                    multiValued: true,
                },
                material: {
                    type: 'string',
                    multiValued: true,
                },
                sale: {
                    type: 'string',
                    multiValued: true,
                },
                strap_bags: {
                    type: 'string',
                    multiValued: true,
                },
                style_bags: {
                    type: 'string',
                    multiValued: true,
                },
                new: {
                    type: 'string',
                    multiValued: true,
                },
                performance_fabric: {
                    type: 'string',
                    multiValued: true,
                },
                category_gear: {
                    type: 'string',
                    multiValued: true,
                },
                gender: {
                    type: 'string',
                    multiValued: true,
                },
                color: {
                    type: 'string',
                    multiValued: true,
                },
                size: {
                    type: 'string',
                    multiValued: true,
                },
                format: {
                    type: 'string',
                    multiValued: true,
                },
                eco_collection: {
                    type: 'string',
                    multiValued: true,
                },
                price_type: {
                    type: 'string',
                    multiValued: true,
                },
                climate: {
                    type: 'string',
                    multiValued: true,
                },
                pattern: {
                    type: 'string',
                    multiValued: true,
                },
                style_general: {
                    type: 'string',
                    multiValued: true,
                },
                style_bottom: {
                    type: 'string',
                    multiValued: true,
                }
            })
            .then(res => {
// console.log('define res', res);
            let importData = [];
            let attributes = {};
            let data = require('./data/mage/convertcsv.js');
            data.forEach(function(item,i ){
                // console.log('item', item);
                let d = {
                    sku: item.sku,
                    doc_type: 'product',
                    parent: item.sku.split('-')[0],
                    name: item.name,
                    product_type: item.product_type,
                    categories: item.categories.split(','),
                    url: item.url_key,
                    description: item.description,
                    price: parseFloat(item.price),
                    special_price: parseFloat(item.special_price),
                    image: item.base_image,
                    additional_images: item.additional_images.split(','),
                    additional_attributes: item.additional_attributes.split(',')

                }
// console.log(d)
                d.additional_attributes.forEach(function(a,i){
                    attr = a.split('=');
                    if(typeof attr[1] === 'string') {
                        d[attr[0]] = attr[1].split('|');
                        if(typeof attributes[attr[0]] === 'undefined'){
                            attributes[attr[0]] = {count:1};
                        }else {
                        attributes[attr[0]].count = attributes[attr[0]].count +1;

                        }
                    }
                });
                // createdAt: new Date(item.created_at).toISOString(),
                //     updatedAt: new Date(item.updated_at).toISOString(),
                if(d.product_type != 'configurable') {

                    importData.push(d);
                }
            })
            console.log('importData',importData.length);
            // console.log('attributes',attributes);
            // console.log(importData);
            app.service('solr').create(importData)
                .then(res => {
                    console.log('added demo data')
                })
                .catch(err => { console.log('EROOR', err) });

        }).catch(err => { console.log(err) });
    }).catch(err => { console.log(err) });


app.use(errorHandler());


console.log('done');
