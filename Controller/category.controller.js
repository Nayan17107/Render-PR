const CategoryModel = require('../Model/category.model');
const path = require('path');
const fs = require('fs');

exports.addcategorypage = async (req, res) => {
    try {
        res.render('Category/AddCategory');
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}

exports.addcategory = async (req, res) => {
    try {
        let imagepath = "";

        if (req.file) {
            imagepath = `/uploads/${req.file.filename}`
        }

        await CategoryModel.create({
            ...req.body,
            categoryimage: imagepath
        })
        req.flash('success', "Category Added!!!!")
        res.redirect('/category/add-category');
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}

exports.viewcategory = async (req, res) => {
    try {
        const categories = await CategoryModel.find();
        res.render('Category/ViewCategory', { categories });
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}

exports.editcategory = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id);

        let category = await CategoryModel.findById(id)
        res.render('Category/EditCategory', { category });
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}

exports.updatecategory = async (req, res) => {
    let id = req.params.id;
    let imagepath;
    let category = await CategoryModel.findById(id);

    if (!category) {
        console.log("Category not found");
        return res.redirect("/category/view-category");
    }

    if (req.file && req.file.filename) {

        if (category.categoryimage) {
            const oldPath = path.join(__dirname, "..", category.categoryimage);
            try {
                fs.unlinkSync(oldPath);
                console.log("Deleted old image:", oldPath);
            } catch (err) {
                console.log("Old image missing:", err.message);
            }
        }

        imagepath = `/uploads/${req.file.filename}`;

    } else {
        imagepath = category.categoryimage;
    }

    await CategoryModel.findByIdAndUpdate(
        id,
        { ...req.body, categoryimage: imagepath },
        { new: true }
    );
    
    req.flash('success', "Category Updated!!!!")
    return res.redirect("/category/view-category");
};


exports.detetecategory = async (req, res) => {
    try {
        let id = req.params.id;
        let category = await CategoryModel.findById(id);

        if (!category) {
            // console.log("Category is not found");
            return res.redirect('/category/view-category');
        }

        if (category.categoryimage && category.categoryimage != "") {
            let imagepath = path.join(__dirname, "..", category.categoryimage)
            try {
                fs.unlinkSync(imagepath);
                console.log('Deleted image file:', imagepath);
            } catch (err) {
                console.log('File Missing: ', err.message)
            }
        }
        await CategoryModel.findByIdAndDelete(id);
        req.flash('warning', "Category Deleted!!!!")
        return res.redirect('/category/view-category');
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}