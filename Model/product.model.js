const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        categoryid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        },
        subcategoryid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubCategory',
            required: true
        },
        extracategoryid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ExtraCategory',
            required: true
        },
        productname: {
            type: String,
            required: true,
            trim: true
        },
        brandname: {
            type: String,
            trim: true
        },
        description: {
            type: String,
            default: ''
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        discountprice: {
            type: Number,
            default: 0,
            min: 0
        },
        stock: {
            type: Number,
            required: true,
            default: 0,
            min: 0
        }, 
        image: {
            type: String
        },
        images: {
            type: [String],
            default: []
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
