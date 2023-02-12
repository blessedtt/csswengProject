const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

//route functions
const { addCategory, removeCategory, getCategories } = require('./modules/category');
const { addProduct, removeProduct, getProducts } = require('./modules/product');
const { getFilteredProducts } = require('./modules/filterProduct')


//user authentication modules
const { isPublic, isPrivate } = require('./modules/uauth/userAuth');
const { loginValidation, registerValidation } = require('./modules/uauth/userValidation');
const { loginUser, registerUser } = require('./modules/uauth/userController');

//TODO: When connecting to the frontend, ensure that the fields sent follow the parameter names
/********************
 *     CATEGORY 
 ********************/

//get categories as array
app.use('/get/category', async (req, res, next) =>{
	categories = await getCategories()
	console.log(categories);
	//TODO: send array data to view
	res.send(categories);
	next();
})

//add category render
app.get('/category/add', (req,res) =>{
	res.render('addcategorytest.html');
})

//remove category render
app.get('/category/remove', (req, res) =>{
	res.render('removecategorytest.html');
});

/** req.param parameters:
 *      name - name of category
*/
app.post('/category/add', addCategory);

/** req.param parameters:
 *      name - name of category
*/
app.post('/category/remove', removeCategory);


/****************
 * 	PRODUCTS
 ****************/

//add product render
app.get('/product/add', (req,res) =>{
	res.render('addproducttest.html');
})

/** req.body parameters: 
 * 		pname - product name
 *      category - category ID of product
 *      desc - description of product
 *      brand - brand of product
 *      price - price of product
*/
app.post('/product/add', addProduct)

//remove product render
app.get('/product/remove', (req, res) =>{
	res.render('removeproducttest.html');
})

/** req.body parameters:
 * 		id - product ID to remove
 */
app.post('/product/remove', removeProduct)

//get products as array
app.use('/get/product', async (req, res, next) =>{
	products = await getProducts()
	console.log(products);
	//TODO: send array data to view
	res.send(products);
	next();
});

/************** 
 * 	 FILTERS
 **************/
//TODO this might not be final version, but this is my current implementation

app.use('/product/filter', async (req, res) =>{
	products = await getFilteredProducts();
	console.log(products);
	//TODO: send filtered products to view
	res.send(products);
	next();
})

module.exports = app;