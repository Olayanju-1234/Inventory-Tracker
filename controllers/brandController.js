var Brand = require('../models/brand');
var Product = require('../models/product');
var async = require('async');
const {body, validationResult} = require('express-validator');


// Get all brand list
exports.brand_list = function(req, res) {
    Brand.find({}, 'brand_name brand_desc')
    .sort({'brand_name': 1})
    .exec(function(err, list_brands) {
        if (err) {
            return next(err);
        }
        res.render('brand_list', {title:'Brand List', brand_list: list_brands});
    })
}

// Get brand detail
exports.brand_detail = function(req, res) {
    async.parallel({
        brand: function(callback) {
            Brand.findById(req.params.id)
            .exec(callback);
        },
        brand_products: function(callback) {
            Product.find({'brand': req.params.id})
            .exec(callback);
        }
    }, function(err, results) {
        if (err) {
            return next(err);
        }
        if (results.brand==null) { // No results.
            var err = new Error('Brand not found');
            err.status = 404;
            return next(err);
        }
        res.render('brand_detail', {title:'Brand Detail', brand: results.brand, brand_products: results.brand_products});
    }
    );

}

// Display brand create form on GET
exports.brand_create_get = function(req, res, next) {
    res.render('brand_form', {title:'Create Brand'});
    
}

// Handle brand create on POST
exports.brand_create_post = [// Validate fields
    body('brand_name', 'Brand name must be specified.').trim().isLength({min: 1}).escape(),
    body('brand_desc', 'Brand description must be specified.').trim().isLength({min: 1}).escape(),
(req, res, next) => {
    const errors = validationResult(req);
    
    var brand = new Brand(
        {brand_name: req.body.brand_name,
        brand_desc: req.body.brand_desc}
    );
    if (!errors.isEmpty()) {
        res.render('brand_form', {title:'Create Brand', brand: brand, errors: errors.array()});
        return;
    }
    else {
        Brand.findOne({'brand_name': req.body.brand_name}) // Check if brand already exists in DB
        .exec(function(err, found_brand) {
            if (err) {
                return next(err);
            }
            if (found_brand) {
                res.redirect(found_brand.url);
            }
            else {
                brand.save(function(err) {
                    if (err) {
                        return next(err);
                    }
                    res.redirect(brand.url);
                });
            }
        });
    }
}
];
    

// // Display brand delete form on GET
// exports.brand_delete_get = function(req, res) {
//     res.send('NOT IMPLEMENTED: Brand delete GET');
// }

// // Handle brand delete on POST
// exports.brand_delete_post = function(req, res) {
//     res.send('NOT IMPLEMENTED: Brand delete POST');
// }

// // Display brand update form on GET
// exports.brand_update_get = function(req, res) {
//     res.send('NOT IMPLEMENTED: Brand update GET');
// }

// // Handle brand update on POST
// exports.brand_update_post = function(req, res) {
//     res.send('NOT IMPLEMENTED: Brand update POST');
// }



