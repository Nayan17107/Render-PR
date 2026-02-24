const ProductModel = require('../Model/product.model');
const CategoryModel = require('../Model/category.model');
const SubCategoryModel = require('../Model/subcategory.model');
const ExtracategoryModel = require('../Model/extracategory.model');
const mongoose = require('mongoose');

const normalizeImagePath = (value) => {
    const raw = String(value || '').trim();
    if (!raw) return '';

    if (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('data:')) {
        return raw;
    }

    let normalized = raw.replace(/\\/g, '/');
    normalized = normalized.replace(/^\.?\//, '');

    if (normalized.startsWith('uploads/')) {
        return `/${normalized}`;
    }

    if (normalized.startsWith('/uploads/')) {
        return normalized;
    }

    return `/${normalized}`;
};

exports.product = async (req, res) => {
    try {
        let {
            search = '',
            categoryid = '',
            subcategoryid = '',
            extracategoryid = '',
            minprice = '',
            maxprice = '',
            sort = 'newest'
        } = req.query;

        search = String(search || '').trim();
        categoryid = String(categoryid || '').trim();
        subcategoryid = String(subcategoryid || '').trim();
        extracategoryid = String(extracategoryid || '').trim();
        minprice = String(minprice || '').trim();
        maxprice = String(maxprice || '').trim();
        sort = String(sort || 'newest').trim();

        const filter = {};

        if (search) {
            filter.$or = [
                { productname: { $regex: search, $options: 'i' } },
                { brandname: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        if (categoryid && mongoose.Types.ObjectId.isValid(categoryid)) filter.categoryid = categoryid;
        if (subcategoryid && mongoose.Types.ObjectId.isValid(subcategoryid)) filter.subcategoryid = subcategoryid;
        if (extracategoryid && mongoose.Types.ObjectId.isValid(extracategoryid)) filter.extracategoryid = extracategoryid;

        const hasMin = minprice !== '';
        const hasMax = maxprice !== '';
        const min = hasMin ? Number(minprice) : NaN;
        const max = hasMax ? Number(maxprice) : NaN;

        if ((hasMin && !Number.isNaN(min)) || (hasMax && !Number.isNaN(max))) {
            filter.price = {};
            if (hasMin && !Number.isNaN(min)) filter.price.$gte = min;
            if (hasMax && !Number.isNaN(max)) filter.price.$lte = max;
        }

        let sortOption = { createdAt: -1 };
        switch (sort) {
            case 'price_low_high':
                sortOption = { price: 1 };
                break;
            case 'price_high_low':
                sortOption = { price: -1 };
                break;
            case 'rating_high_low':
                sortOption = { rating: -1 };
                break;
            case 'name_a_z':
                sortOption = { productname: 1 };
                break;
            case 'name_z_a':
                sortOption = { productname: -1 };
                break;
            case 'oldest':
                sortOption = { createdAt: 1 };
                break;
            default:
                sort = 'newest';
                sortOption = { createdAt: -1 };
                break;
        }

        // fetch products without populate to avoid cast errors when refs are invalid
        const productsRaw = await ProductModel.find(filter).sort(sortOption).lean();

        // collect valid referenced ids
        const catIds = new Set();
        const subIds = new Set();
        const extraIds = new Set();
        productsRaw.forEach((it) => {
            if (it && it.categoryid && mongoose.Types.ObjectId.isValid(String(it.categoryid))) catIds.add(String(it.categoryid));
            if (it && it.subcategoryid && mongoose.Types.ObjectId.isValid(String(it.subcategoryid))) subIds.add(String(it.subcategoryid));
            if (it && it.extracategoryid && mongoose.Types.ObjectId.isValid(String(it.extracategoryid))) extraIds.add(String(it.extracategoryid));
        });

        const [fCategories, fSubcategories, fExtracategories] = await Promise.all([
            catIds.size ? CategoryModel.find({ _id: { $in: Array.from(catIds) } }).select('categoryname').lean() : [],
            subIds.size ? SubCategoryModel.find({ _id: { $in: Array.from(subIds) } }).select('subcategoryname').lean() : [],
            extraIds.size ? ExtracategoryModel.find({ _id: { $in: Array.from(extraIds) } }).select('extracategoryname').lean() : []
        ]);

        const catMap = new Map(fCategories.map((c) => [String(c._id), c]));
        const subMap = new Map(fSubcategories.map((s) => [String(s._id), s]));
        const extraMap = new Map(fExtracategories.map((e) => [String(e._id), e]));

        const products = productsRaw.map((item) => {
            const image = normalizeImagePath(item.image);
            const images = Array.isArray(item.images)
                ? item.images.map(normalizeImagePath).filter(Boolean)
                : [];

            // attach populated-like objects only when we have valid referenced docs
            const categoryObj = item.categoryid && catMap.has(String(item.categoryid)) ? catMap.get(String(item.categoryid)) : (item.categoryid || null);
            const subcategoryObj = item.subcategoryid && subMap.has(String(item.subcategoryid)) ? subMap.get(String(item.subcategoryid)) : (item.subcategoryid || null);
            const extracategoryObj = item.extracategoryid && extraMap.has(String(item.extracategoryid)) ? extraMap.get(String(item.extracategoryid)) : (item.extracategoryid || null);

            return {
                ...item,
                categoryid: categoryObj,
                subcategoryid: subcategoryObj,
                extracategoryid: extracategoryObj,
                image: image || images[0] || '',
                images
            };
        });

        const categories = await CategoryModel.find().sort({ categoryname: 1 });

        let subcategoriesQuery = {};
        if (categoryid && mongoose.Types.ObjectId.isValid(categoryid)) {
            subcategoriesQuery.categoryid = categoryid;
        }
        const subcategories = await SubCategoryModel.find(subcategoriesQuery).sort({ subcategoryname: 1 });

        let extracategoriesQuery = {};
        if (subcategoryid && mongoose.Types.ObjectId.isValid(subcategoryid)) {
            extracategoriesQuery.subcategoryid = subcategoryid;
        }
        const extracategories = await ExtracategoryModel.find(extracategoriesQuery).sort({ extracategoryname: 1 });

        res.render('web/WebSite', {
            products,
            categories,
            subcategories,
            extracategories,
            filters: {
                search,
                categoryid,
                subcategoryid,
                extracategoryid,
                minprice,
                maxprice,
                sort
            }
        });
    } catch (error) {
        console.error(error);
        return res.redirect('/');
    }
};

exports.productdetails = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).render('web/ProductDetails', { product: null, gallery: [] });
        }

        const productRaw = await ProductModel.findById(id)
            .populate('categoryid', 'categoryname')
            .populate('subcategoryid', 'subcategoryname')
            .populate('extracategoryid', 'extracategoryname')
            .lean();

        if (!productRaw) {
            return res.status(404).render('web/ProductDetails', { product: null, gallery: [] });
        }

        const product = {
            ...productRaw,
            image: normalizeImagePath(productRaw.image),
            images: Array.isArray(productRaw.images)
                ? productRaw.images.map(normalizeImagePath).filter(Boolean)
                : []
        };

        let gallery = [];
        if (product.image) gallery.push(product.image);
        if (product.images.length) gallery.push(...product.images);
        gallery = [...new Set(gallery)];

        return res.render('web/ProductDetails', { product, gallery });
    } catch (error) {
        console.error(error);
        return res.redirect('/web/product');
    }
};
