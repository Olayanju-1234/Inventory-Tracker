var Express = require('express');
var router = Express.Router();

// Require all controllers modules
var category_controller = require('../controllers/categoryController');
var brand_controller = require('../controllers/brandController');
var product_controller = require('../controllers/productController');
var productinstance_controller = require('../controllers/productinstanceController');

// Product Routes

// Get product home page
router.get('/', product_controller.index);

// Get request for creating new products
router.get('/product/create', product_controller.product_create_get);

// Post request for creating new products
router.post('/product/create', product_controller.product_create_post);

// Get request for deleting products
router.get('/product/:id/delete', product_controller.product_delete_get);

// Post request for deleting products
router.post('/product/:id/delete', product_controller.product_delete_post);

// Get request for updating products
router.get('/product/:id/update', product_controller.product_update_get);

// Post request for updating products
router.post('/product/:id/update', product_controller.product_update_post);

// Get request for a single product
router.get('/product/:id', product_controller.product_detail);

// Get request for list of all products
router.get('/products', product_controller.product_list);

// Category Routes

// Get request for creating new categories
router.get('/category/create', category_controller.category_create_get);

// Post request for creating new categories
router.post('/category/create', category_controller.category_create_post);

// // Get request for deleting categories
// router.get('/category/:id/delete', category_controller.category_delete_get);

// // Post request for deleting categories
// router.post('/category/:id/delete', category_controller.category_delete_post);

// // Get request for updating categories
// router.get('/category/:id/update', category_controller.category_update_get);

// // Post request for updating categories
// router.post('/category/:id/update', category_controller.category_update_post);

// Get request for a single category
router.get('/category/:id', category_controller.category_detail);

// Get request for list of all categories
router.get('/categories', category_controller.category_list);


// Brand Routes
// Get request for creating new brands
router.get('/brand/create', brand_controller.brand_create_get);

// Post request for creating new brands
router.post('/brand/create', brand_controller.brand_create_post);

// // Get request for deleting brands
// router.get('/brand/:id/delete', brand_controller.brand_delete_get);

// // Post request for deleting brands
// router.post('/brand/:id/delete', brand_controller.brand_delete_post);

// // Get request for updating brands
// router.get('/brand/:id/update', brand_controller.brand_update_get);

// // Post request for updating brands
// router.post('/brand/:id/update', brand_controller.brand_update_post);

// Get request for a single brand
router.get('/brand/:id', brand_controller.brand_detail);

// Get request for list of all brands
router.get('/brands', brand_controller.brand_list);

// Productinstance Routes
// Get request for creating new productinstances
router.get('/productinstance/create', productinstance_controller.productinstance_create_get);

// Post request for creating new productinstances
router.post('/productinstance/create', productinstance_controller.productinstance_create_post);

// Get request for deleting productinstances
router.get('/productinstance/:id/delete', productinstance_controller.productinstance_delete_get);

// Post request for deleting productinstances
router.post('/productinstance/:id/delete', productinstance_controller.productinstance_delete_post);

// Get request for updating productinstances
router.get('/productinstance/:id/update', productinstance_controller.productinstance_update_get);

// Post request for updating productinstances
router.post('/productinstance/:id/update', productinstance_controller.productinstance_update_post);

// Get request for a single productinstance
router.get('/productinstance/:id', productinstance_controller.productinstance_detail);

// Get request for list of all productinstances
router.get('/productinstances', productinstance_controller.productinstance_list);

module.exports = router;