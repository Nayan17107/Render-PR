const BlogModel = require("../Model/blog.model")
const path = require('path')
const fs = require('fs')

exports.addblogpage = async (req, res) => {
    try {
        res.render('Blog/AddBlog');
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}

exports.addblog = async (req, res) => {
    try {
        let imagepath = "";

        if (req.file) {
            imagepath = `/uploads/${req.file.filename}`
        }

        await BlogModel.create({
            ...req.body,
            image: imagepath
        })
        res.redirect('/blog/view-blog');
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}

exports.viewblog = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 6;
        const skip = (page - 1) * limit;

        let filter = {};
        
        // Search by title or author name
        if (req.query.search) {
            filter.$or = [
                { title: { $regex: req.query.search, $options: 'i' } },
                { name: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        // Filter by category
        if (req.query.category && req.query.category !== '') {
            filter.category = req.query.category;
        }

        // Sort by status (draft/published)
        let sortBy = {};
        if (req.query.sort) {
            if (req.query.sort === 'draft') {
                filter.status = 'Draft';
            } else if (req.query.sort === 'published') {
                filter.status = 'Published';
            }
        }

        // Get total count for pagination
        const totalBlogs = await BlogModel.countDocuments(filter);
        const totalPages = Math.ceil(totalBlogs / limit);

        // Get blogs with pagination
        const blogs = await BlogModel.find(filter)
            .limit(limit)
            .skip(skip);

        // Get all unique categories for filter dropdown
        const categories = await BlogModel.distinct('category');

        res.render('Blog/ViewBlog', { 
            blogs, 
            currentPage: page,
            totalPages: totalPages,
            search: req.query.search || '',
            category: req.query.category || '',
            sort: req.query.sort || '',
            categories: categories
        });
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}

exports.viewSingleblog = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await BlogModel.findById(id);

        if (!blog) {
            return res.status(404).render('Blog/ViewBlog', { blogs: [], error: 'Blog not found' });
        }

        res.render('Blog/ViewSingleBlog', { blog })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}

exports.deleteblog = async (req, res) => {
    try {
        let id = req.params.id;
        let blog = await BlogModel.findById(id);

        if (!blog) {
            // console.log("blog is not found");
            return res.redirect('/blog/view-blog');
        }

        if (blog.image && blog.image != "") {
            let imagepath = path.join(__dirname, "..", blog.image)
            try {
                fs.unlinkSync(imagepath);
                console.log('Deleted image file:', imagepath);
            } catch (err) {
                console.log('File Missing: ', err.message)
            }
        }
        await BlogModel.findByIdAndDelete(id);
        return res.redirect('/blog/view-blog');
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}

exports.editblog = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id);

        let blog = await BlogModel.findById(id)
        res.render('Blog/EditBlog', { blog });
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}

exports.updateblog = async (req, res) => {
    let id = req.params.id;
    let imagepath;
    let blog = await BlogModel.findById(id);

    if (!blog) {
        console.log("blog is not found");
        return res.redirect("/blog/view-blog");
    }

    if (req.file) {
        if (blog.image != "") {
            imagepath = path.join(__dirname, "..", blog.image)
            try {
                fs.unlinkSync(imagepath);
                console.log('Deleted old image:', imagepath);
            } catch (err) {
                console.log('File Missing: ', err.message)
            }
        }
        imagepath = `/uploads/${req.file.filename}`
    } else {
        imagepath = blog.image;
    }
    await BlogModel.findByIdAndUpdate(id, { ...req.body, image: imagepath }, { new: true });
    return res.redirect("/blog/view-blog");
};