const SubCategoryModel = require('../Model/subcategory.model');
const CategoryModel = require('../Model/category.model');
const ExtracategoryModel = require('../Model/extracategory.model');
const path = require('path');
const fs = require('fs');

exports.addextracategorypage = async (req, res) => {
    try {
        let category = await CategoryModel.find();
        let subcategory = await SubCategoryModel.find();
        res.render('ExtraCategory/AddExtraCategory', { category, subcategory });
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
};

exports.addextracategory = async (req, res) => {
    try {
        // console.log(req.body);
        await ExtracategoryModel.create({
            ...req.body
        })
        req.flash('success', "ExtraCategory Added!!!!")
        res.redirect('/extracategory/add-extracategory');
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
};

exports.getAllSubCategories = async (req, res) => {
    try {
        const subCategories = await SubCategoryModel.find({ categoryid: req.params.id });
        return res.json({ message: 'Fetch all subcategory', subCategories })
    } catch (error) {
        console.log(error)
        return res.redirect("/")
    }
}

exports.viewextracategory = async (req, res) => {
    try {
        let extracategories = await ExtracategoryModel.find().populate({ path: 'categoryid' }).populate({ path: 'subcategoryid' })
        // console.log(extracategories);
        res.render('ExtraCategory/ViewExtraCategory', { extracategories });
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
};

exports.deleteextracategory = async (req, res) => {
    try {
        let id = req.params.id;
        let extracategory = await ExtracategoryModel.findById(id);

        if (!extracategory) {
            // console.log("Extra Category is not found");
            return res.redirect('/extracategory/view-extracategory');
        }

        await ExtracategoryModel.findByIdAndDelete(id);
        req.flash('success', "ExtraCategory Deleted!!!!")
        return res.redirect('/extracategory/view-extracategory');
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
};

exports.editextracategory = async (req, res) => {
    try {
        const id = req.params.id;
        // console.log(id);

        let extracategory = await ExtracategoryModel.findById(id)
        res.render('ExtraCategory/EditExtraCategory', { extracategory });
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
};

exports.updateectraCategory = async (req, res) => {
    try {
        let id = req.params.id;
        // console.log(req.body.subcategory);

        await ExtracategoryModel.findByIdAndUpdate(
            id,
            { ...req.body },
            { new: true }
        );

        // console.log(subcategory)
        req.flash('success', "ExtraCategory Updated!!!!")
        res.redirect('/extracategory/view-extracategory')
    } catch (error) {
        console.log(error)
    }
};