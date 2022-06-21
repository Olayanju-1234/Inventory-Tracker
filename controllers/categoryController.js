var Category = require('../models/category');
var Product = require('../models/product');
var async = require('async');
const {body, validationResult} = require('express-validator');


// Get all categories
exports.category_list = function(req, res) {
    Category.find()
    .sort({'category_name': 1})
    .exec(function(err, list_categories) {
        if (err) {
            return next(err);
        }
        res.render('category_list', {title:'Category List', category_list: list_categories});
    }
    );
}

// Get category detail
exports.category_detail = function(req, res) {
    async.parallel({
        category: function(callback) {
            Category.findById(req.params.id)
            .exec(callback);
        },
        category_products: function(callback) {
            Product.find({'category': req.params.id})
            .exec(callback);
        },
    }, function(err, results) {
        if (err) {
            return next(err);
        }
        if (results.category==null) { // No results.
            var err = new Error('Category not found');
            err.status = 404;
            return next(err);
        }
        res.render('category_detail', {title:'Category Detail', category: results.category, category_products: results.category_products});
    });
}

// Display category create form on GET
exports.category_create_get = function(req, res) {
    res.render('category_form', {title:'Create Category'});
}

// Handle category create on POST
exports.category_create_post = [
    // Validate fields
    body('category_name', 'Category name must be specified.').trim().isLength({min: 1}).escape(),
    body('category_desc', 'Category description must be specified.').trim().isLength({min: 1}).escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('category_form', {title:'Create Category', category: category, errors: errors.array()});
            return;
        }
        else {
            
        var category = new Category(
            {category_name: req.body.category_name,
            category_desc: req.body.category_desc}
        );

            category.save(function (err) {
                if (err) {
                    return next(err);
                }
                res.redirect(category.url);
            });
        }

}
]

// // Display category delete form on GET
// exports.category_delete_get = function(req, res) {
//     res.send('NOT IMPLEMENTED: Category delete GET');
// }

// // Handle category delete on POST
// exports.category_delete_post = function(req, res) {
//     res.send('NOT IMPLEMENTED: Category delete POST');
// }

// // Display category update form on GET
// exports.category_update_get = function(req, res) {
//     res.send('NOT IMPLEMENTED: Category update GET');
// }

// // Handle category update on POST
// exports.category_update_post = function(req, res) {
//     res.send('NOT IMPLEMENTED: Category update POST');
// }

