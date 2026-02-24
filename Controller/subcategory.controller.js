const SubCategoryModel = require('../Model/subcategory.model');
const CategoryModel = require('../Model/category.model');
const path = require('path');
const fs = require('fs');

exports.addsubcategorypage = async (req, res) => {
    try {
        let category = await CategoryModel.find();
        res.render('SubCategory/AddSubCategory', { category });
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
};

exports.addsubcategory = async (req, res) => {
    try {
        // console.log(req.body);
        await SubCategoryModel.create({
            ...req.body
        })
        req.flash('success', "SubCategory Added!!!!")
        res.redirect('/subcategory/add-subcategory');
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
};

exports.viewsubcategory = async (req, res) => {
    try {
        let subcategories = await SubCategoryModel.find().populate('categoryid')
        // console.log(subcategories);
        res.render('SubCategory/ViewSubCategory', { subcategories });
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
};


exports.deletesubcategory = async (req, res) => {
    try {
        let id = req.params.id;
        let subcategory = await SubCategoryModel.findById(id);

        if (!subcategory) {
            // console.log("Category is not found");
            return res.redirect('/subcategory/view-subcategory');
        }

        await SubCategoryModel.findByIdAndDelete(id);
        req.flash('success', "SubCategory Deleted!!!!")
        return res.redirect('/subcategory/view-subcategory');
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
};

exports.editsubcategory = async (req, res) => {
    try {
        const id = req.params.id;
        // console.log(id);

        let subcategory = await SubCategoryModel.findById(id)
        res.render('SubCategory/EditSubCategory', { subcategory });
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
};


exports.updateSubCategory = async (req, res) => {
    try {
        let id = req.params.id;
        console.log(req.body.subcategory);

        await SubCategoryModel.findByIdAndUpdate(
            id,
            { ...req.body },
            { new: true }
        );

        // console.log(subcategory)
        req.flash('success', "SubCategory Updated!!!!")
        res.redirect('/subcategory/view-subcategory')
    } catch (error) {
        console.log(error)
    }
}   
