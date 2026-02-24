const express = require('express');
const { addproductpage, getAllSubCategories, getAllExtraCategories, addproduct, viewproduct, viewsingleproduct, deletproduct, editproduct, updateproduct } = require('../Controller/product.controller');
const upload = require('../Middleware/ImageUpload');
const routes = express.Router();

routes.get('/add-product', addproductpage);
routes.get('/subcategory/:id', getAllSubCategories);
routes.get('/extracategory/:id', getAllExtraCategories);
routes.post('/add-product', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 10 }]), addproduct);
routes.get('/view-product', viewproduct);
routes.get('/view-single-product/:id', viewsingleproduct);
routes.get('/delete-product/:id', deletproduct);
routes.get('/edit-product/:id', editproduct);
routes.post('/update-product/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 10 }]), updateproduct);

module.exports = routes;
