#! /usr/bin/env node

console.log('This script populates some test products, categories, brands and productinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://inventorytracking:josephstudent@cluster0.smup3.mongodb.net/inventory_tracking?retryWrites=true&w=majority');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Brand = require('./models/brand')
var Category = require('./models/category')
var Product = require('./models/product')
var ProductInstance = require('./models/productinstance')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var products = []
var categories = []
var brands = []
var productinstances = []

function brandCreate(brand_name, brand_desc, cb) {
  var brandDetail = {
    brand_name: brand_name , 
    brand_desc: brand_desc
  }

  var brand = new Brand(brandDetail);
       
  brand.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Brand: ' + brand);
    brands.push(brand)
    cb(null, brand);
  }   );
}

function categoryCreate(category_name, category_desc, cb) {
  var categorydetail = { 
    category_name: category_name,
    category_desc: category_desc
  }
    
  var category = new Category(categorydetail);    
  category.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Category: ' + category);
    categories.push(category)
    cb(null, category)
  }  );
}


function productCreate(product_name, product_price, date_added, category, brand ,cb) {
  var productdetail = {product_name:product_name , product_price: product_price, date_added:date_added,
  category: category,
  brand: brand}
  
  
  var product = new Product(productdetail);
       
  product.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Product: ' + product);
    products.push(product)
    cb(null, product)
  }  );
}



function productInstanceCreate(product, status, check_back_date, cb) {
  var productinstancedetail = { 
    product: product,
  }    
  if (check_back_date != false) productinstancedetail.check_back_date = check_back_date;
  if (status != false) productinstancedetail.status = status
    
  var productinstance = new ProductInstance(productinstancedetail);    
  productinstance.save(function (err) {
    if (err) {
      console.log('ERROR CREATING ProductInstance: ' + productinstance);
      cb(err, null)
      return
    }
    console.log('New ProductInstance: ' + productinstance);
    productinstances.push(productinstance)
    cb(null, product)
  }  );
}


function createBrandCategory(cb) {
    async.series([
      function (callback) {
        brandCreate("Samsung", "Samsung is a brand of electronic equipment and electronics company headquartered in Seoul, South Korea. It is the largest manufacturer of consumer electronics, and the world's largest manufacturer of TVs, computers, and other electronics.", callback);
      },
      function (callback) {
        brandCreate("LG", "LG Electronics is a South Korean electronics company headquartered in Seoul. It is the largest manufacturer of consumer electronics, and the world's largest manufacturer of TVs, computers, and other electronics.", callback);
      },
      function(callback) {
        categoryCreate("Office", "Used in surfing the office", callback);
      },
      function(callback) {
        categoryCreate("Home", "Used in surfing the home", callback);
      }
     ],
        // optional callback
        cb);
}

function createProducts(cb) {
  async.parallel([
    function(callback) {
      productCreate("Samsung Galaxy S10", 1000, new Date(), categories[0], brands[0], callback);
    },
    function(callback) {
      productCreate("Samsung Galaxy S10+", 1100, new Date(), categories[1], brands[0], callback);
    },
    function(callback) {
      productCreate("Samsung Galaxy S10 Edge", 1200, new Date(), categories[1], brands[0], callback);
    } 
  ],
    // optional callback
    cb);
}



function createProductInstance(cb) {
    async.parallel([
        function(callback) {
          productInstanceCreate(products[0], 'Available', '2022-06-02', callback)
        },
        function(callback) {
          productInstanceCreate(products[1], 'Out of stock', '2022-06-02', callback)
        },
        function(callback) {
          productInstanceCreate(products[1], 'Out of stock', '2022-06-02', callback)
        }
        ],
        // Optional callback
        cb);
}



async.series([
    createBrandCategory,
    createProducts,
    createProductInstance
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('ProductInstance: '+productinstances);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});



