const express = require('express')
const routes = express.Router();
const upload = require('../Middleware/ImageUpload');
const { addblog, addblogpage, viewblog, viewSingleblog, deleteblog, editblog, updateblog } = require('../Controller/blog.controller');

routes.get('/add-blog', addblogpage);
routes.post('/add-blog', upload.single('image'), addblog);
routes.get('/view-blog', viewblog);
routes.get('/view-single-blog/:id', viewSingleblog);
routes.get('/delete-blog/:id', deleteblog);
routes.get('/edit-blog/:id', editblog);
routes.post('/update-blog/:id', upload.single('image'), updateblog);

module.exports = routes;