var Product = require('../models/product');
var Brand = require('../models/brand');
var Category = require('../models/category');
var ProductInstance = require('../models/productinstance');
const {body, validationResult} = require('express-validator');

var async = require('async');

// Site home page
exports.index = function(req, res) {
    async.parallel({
        total_products: function(callback) {
            Product.countDocuments({}, callback);
        },
        total_categories: function(callback) {
            Category.countDocuments({}, callback);
        },
        total_brands: function(callback) {
            Brand.countDocuments({}, callback);
        },
        total_product_instances: function(callback) {
            ProductInstance.countDocuments({}, callback);
        },
        total_available_product_instances: function(callback) {
            ProductInstance.countDocuments({status: 'Available'}, callback);}},
        function(err, results) {
            res.render('index', {title: 'Inventory Tracking Web app', data: results});
        });
};

//Display all products
exports.product_list = function(req, res, next) {
    Product.find({}, 'product_name product_price').
    sort({'product_name':1}).
    exec((err, list_product) => {
        if (err) {return next(err);}
        // Render if successful
        res.render('product_list', {title: 'Product Page', product_list:list_product});
    });
};

//Display a single product
exports.product_detail = function(req, res, next) {    
    async.parallel({
        product: function(callback) {
            Product.findById(req.params.id).
            populate('category').
            populate('brand').
            exec(callback);
        },
        product_instances: function(callback) {
            ProductInstance.find({product: req.params.id}).
            exec(callback);
        },
    }, function(err, results) {
        if (err) {return next(err);}
        if (results.product==null) { // No results.
            var err = new Error('Product not found');
            err.status = 404;
            return next(err);
        }
        // Render if successful
        res.render('product_detail', {title: 'Product Detail', product:results.product, product_instances:results.product_instances});
    }
    );
};

//Display a product create form on GET
exports.product_create_get = function(req, res, next) {
    // Get all categories and brands
    async.parallel({
        categories: function(callback) {
            Category.find(callback);
        },
        brands: function(callback) {
            Brand.find(callback);
        }
    }, function(err, results) {
        if (err) {return next(err);}
        // Render if successful
        res.render('product_form', {title: 'Create Product', categories:results.categories, brands:results.brands});
    }
    );


}

//Handle product create on POST
exports.product_create_post = [
    // Validate fields and sanitize
    body('product_name', 'Product name required').isLength({min: 1}).trim().escape(),
    body('product_price', 'Product price required').isLength({min: 1}).trim().escape(),
    body('category', 'Category required').isLength({min: 1}).trim().escape(),
    body('brand', 'Brand required').isLength({min: 1}).trim().escape(),
    body('date_added', 'Date added required').isLength({min: 1}).trim().escape(),
    
    (req, res, next)=>  {
        const errors = validationResult(req);
        var product = new Product({
            product_name: req.body.product_name,
            product_price: req.body.product_price,
            category: req.body.category,
            brand: req.body.brand,
            date_added: req.body.date_added
        });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
            async.parallel({   
                categories: function(callback) {
                    Category.find(callback);
                },
                brands: function(callback) {
                    Brand.find(callback);
                }
            }, function(err, results) {
                if (err) {return next(err);}
                // Render if successful
                res.render('product_form', {title: 'Create Product', categories:results.categories, brands:results.brands, product:product, errors:errors.array()});
            }
            );
            return;

        } else {
            // Data from form is valid. Save product.
            product.save(function (err) {
                if (err) {return next(err);}
                // Successful - redirect to new product record.
                res.redirect(product.url);
            });
        }
    }
];

// Display product delete form on GET
exports.product_delete_get = function(req, res, next) {
    async.parallel({
        product: function(callback) {
            Product.findById(req.params.id).
            exec(callback);
        },
        product_instances: function(callback) {
            ProductInstance.find({product: req.params.id}).
            exec(callback);
        },
    }, function(err, results) {
        if (err) {return next(err);}
        if (results.product==null) { // No results.
            res.redirect('/products/products');
        }
        // Render if successful
        res.render('product_delete', {title: 'Delete Product', product:results.product, product_instances:results.product_instances});
    });
}

// Handle product delete on POST
exports.product_delete_post = function(req, res, next) {
    async.parallel({
        product: function(callback) {
            Product.findById(req.body.productid).
            exec(callback);
        },
        product_instances: function(callback) {
            ProductInstance.find({product: req.body.productid})
            .populate('product')
            .exec(callback);
        },
    }, function(err, results) {
        if (err) {return next(err);}
        // Successful, redirect to product list
        if (results.product_instances.length > 0) {
            // Product has product instances. Render index page with error.
            res.render('product_delete', {title: 'Delete Product', product:results.product, product_instances:results.product_instances,  error: 'Product has product instances. Cannot delete.'});
            return;
        } else {
            // Product has no product instances. Delete object and redirect to product list.
                Product.findByIdAndRemove(req.body.productid, function deleteProduct(err) {
                    if (err) {return next(err);}
                    // Success - redirect to product list
                    res.redirect('/products/products');
                    
        });
        }
});
};

// Display product update form on GET
exports.product_update_get = function(req, res, next) {
    // Get product, categories, and brands for form
    async.parallel({
        product: function(callback) {
            Product.findById(req.params.id).
            populate('category').
            populate('brand').
            exec(callback);

        },
        categories: function(callback) {
            Category.find(callback);

        },
        brands: function(callback) {
            Brand.find(callback);
        },
    }, function(err, results) {
        if (err) {return next(err);}
        if (results.product==null) { // No results.
            var err = new Error('Product not found');
            err.status = 404;
            return next(err);
        }
        // Render if successful
        res.render('product_form', {title: 'Update Product', product:results.product, categories:results.categories, brands:results.brands});
    }); 
};

// Handle product update on POST
exports.product_update_post = [
    
    // Validate fields and sanitize
    body('product_name', 'Product name required').isLength({min: 1}).trim().escape(),
    body('product_price', 'Product price required').isLength({min: 1}).trim().escape(),
    body('category', 'Category required').isLength({min: 1}).trim().escape(),
    body('brand', 'Brand required').isLength({min: 1}).trim().escape(),
    body('date_added', 'Date added required').isLength({min: 1}).trim().escape(),

    (req, res, next)=>  {
        const errors = validationResult(req);
        var product = new Product({
            product_name: req.body.product_name,
            product_price: req.body.product_price,
            category: req.body.category,
            brand: req.body.brand,
            date_added: req.body.date_added,
            _id: req.params.id
        });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
            async.parallel({   
                categories: function(callback) {
                    Category.find(callback);
                },
                brands: function(callback) {
                    Brand.find(callback);
                },
            }, function(err, results) {
                if (err) {return next(err);}
                // Render if successful
                res.render('product_form', {title: 'Update Product', categories:results.categories, brands:results.brands, product:product, errors:errors.array()});
            }
            );
            return;
            
        } else {
            // Data from form is valid. Update product.
            Product.findByIdAndUpdate(req.params.id, product, {}, function (err, theproduct) {
                if (err) {return next(err);}
                // Successful - redirect to product detail page.
                res.redirect(theproduct.url);
            });
        }
    }
];
    
