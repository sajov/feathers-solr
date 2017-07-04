'use strict';


var faker = require('faker');

exports.product = function(count) {

  var helper = faker.helpers;
  var products = [];

  for(var i = 1; i <= count; i++){

      var name = faker.commerce.productName();
      var price = parseFloat(faker.commerce.price());
      var price_euro = faker.commerce.price(10.9, 17.9, 2, '') * 1;
      var price_dollar = faker.commerce.price(2.9, 7.9, 2, '') * 1;

      var prod = {
        id: (i+1).toString(),
        name: name,
        description: faker.lorem.sentences(),
        sku: faker.finance.mask(),
        url: faker.internet.url() + '/' + faker.helpers.slugify(name),
        price: price,
        image: faker.image.fashion(),
        color: faker.commerce.color(),
        material: faker.commerce.productMaterial(),
        adjective: faker.commerce.productAdjective(),
        // attributes: {
        //   color: faker.commerce.color(),
        //   material: faker.commerce.productMaterial(),
        //   adjective: faker.commerce.productAdjective(),
        // },
        base_color: '#'+(function lol(m,s,c){return s[m.floor(m.random() * s.length)] + (c && lol(m,s,c-1));})(Math,'0123456789ABCDEF',4),
        active: faker.random.boolean(),
        createdAt:faker.date.past(),
        updatedAt:faker.date.past(),
    };


    products.push(prod);

  };
  return products;
}

function dateFormat(date) {
  return date.toISOString().
              replace(/T/, ' ').      // replace T with a space
              replace(/\..+/, '');
}