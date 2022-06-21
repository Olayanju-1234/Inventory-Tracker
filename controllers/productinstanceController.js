var ProductInstance = require('../models/productinstance');
var Product = require('../models/product')
var async = require('async');
const {body, validationResult} = require('express-validator');

// Get product instance list
exports.productinstance_list = function(req, res, next) {
    ProductInstance.find({})
    .populate('product')
    .exec(function(err, list_productinstances) {
        if (err) {
            return next(err);
        }
        res.render('productinstance_list', {title:'Product Instance List', productinstance_list: list_productinstances});
    }
    );
}

// Get product instance detail
exports.productinstance_detail = function(req, res) {
    ProductInstance.findById(req.params.id)
    .populate('product')
    .exec(function(err, productinstance) {
        if (err) {
            return next(err);
        }
        if (productinstance==null) { // No results.
            var err = new Error('Product instance not found');
            err.status = 404;
            return next(err);
        }
        res.render('productinstance_detail', {title:'Product Instance Detail', productinstance: productinstance});
    }
    );
}

// Display product instance create form on GET
exports.productinstance_create_get = function(req, res, next) {
    Product.find({}, 'product_name')
    .exec(function(err, products) {
        if (err) {
            return next(err);
        }
        res.render('productinstance_form', {title:'Create Product Instance', products: products});

    });
}

// Handle product instance create on POST
exports.productinstance_create_post =[
    // Validate and sanitize fields
    body('product', 'Product must be specified').isLength({min: 1}).trim().escape(),
    body('status', 'Status required').isLength({min: 1}).trim().escape(),
    body('check_back', 'Availability required').optional({checkFalsy: true}).isISO8601().toDate(),
    
    
    (req, res, next) => {
        const errors = validationResult(req);
        var productinstance = new ProductInstance({
            product: req.body.product,
            status: req.body.status,
            check_back: req.body.check_back,
        
        });
        if (!errors.isEmpty()) {
            Product.find({}, 'product_name')
            .exec(function(err, products) {
                if (err) {
                    return next(err);
                }
                res.render('productinstance_form', {title:'Create Product Instance', products: products, productinstance: productinstance, errors: errors.array()});
            }
            );
            return;
        }
        else {
            productinstance.save(function (err) {
                if (err) {
                    return next(err);
                }
                res.redirect(productinstance.url);
            });
        }

    }

];

// Display product instance delete form on GET
exports.productinstance_delete_get = function(req, res, next) {
    ProductInstance.findById(req.params.id)
    .populate('product')
    .exec(function(err, productinstance) {
        if (err) {
            return next(err);
        }
        if (productinstance==null) { // No results.
            var err = new Error('Product instance not found');
            err.status = 404;
            return next(err);
        }
        res.render('productinstance_delete', {title:'Delete Product Instance', productinstance: productinstance});
    }
    );
}

// Handle product instance delete on POST
exports.productinstance_delete_post = function(req, res) {
    ProductInstance.findByIdAndRemove(req.body.id, function deleteProductInstance(err) {
        if (err) {
            return next(err);
        }
        res.redirect('/products/productinstances');
    }
    );
}

// Display product instance update form on GET
exports.productinstance_update_get = function(req, res, next) {
    async.parallel({
        productinstance: function(callback) {
            ProductInstance.findById(req.params.id)
            .populate('product')
            .exec(callback);
        },
        products: function(callback) {
            Product.find(callback);
        }
    }, function(err, results) {
        if (err) {
            return next(err);
        }
        if (results.productinstance==null) { // No results.
            var err = new Error('Product instance not found');
            err.status = 404;
            return next(err);
        }
        res.render('productinstance_form', {title:'Update Product Instance', productinstance: results.productinstance, products: results.products});
    }

    );
};

// Handle product instance update on POST
exports.productinstance_update_post =[
    // Validate and sanitize fields
    body('product', 'Product must be specified').isLength({min: 1}).trim().escape(),
    body('status', 'Status required').isLength({min: 1}).trim().escape(),
    body('check_back', 'Availability required').optional({checkFalsy: true}).isISO8601().toDate(),
    
    (req, res, next) => {
        const errors = validationResult(req);
        var productinstance = new ProductInstance({
            product: req.body.product,
            status: req.body.status,
            check_back: req.body.check_back,
            _id: req.params.id

        });
        if (!errors.isEmpty()) {
            Product.find({}, 'product_name')
            .exec(function(err, products) {
                if (err) {
                    return next(err);
                }
                res.render('productinstance_form', {title:'Update Product Instance', products: products, productinstance: productinstance, errors: errors.array()});
            }

            );
            return;

        } else {
            ProductInstance.findByIdAndUpdate(req.params.id, productinstance, {}, function (err, theproductinstance) {
                if (err) {
                    return next(err);
                }
                res.redirect(theproductinstance.url);
            });
        }


    
}
];
