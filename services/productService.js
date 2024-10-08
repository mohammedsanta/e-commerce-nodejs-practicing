const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const { uploadMixOfImage } = require('../middlewares/uploadImageMiddleware');
const factory = require('./handlersFactory');
const Product = require('../models/productModel');


exports.uploadProductImage = uploadMixOfImage([
    {
        name: imageCover,
        maxCount: 1,
    },
    {
        name: image,
        maxCount: 5,
    }
]);

exports.resizeProductImage = asyncHandler(async (req,res,next) => {
    // console.log(req.files)
    //1- Image processing for imageCover
    if (req.files.imageCover) {
        const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`

        await sharp(req.files.imageCover[0].buffer)
            .resize(2000,1333)
            .toFormate('jpeg')
            .jpeg({ quality: 95 })
            .toFile(`uploads/products/${imageCoverFileName}`);
    
        // Save image into our db
        req.body.imageCover = imageCoverFileName
    }

    //2- Image processing for image
    if (req.files.images) {
        req.body.images = [];
        await Promise.all(
            req.files.images.map(async (img, index) => {
                const imageName = `product-${uuidv4}-${Date.now()}-${index + 1}.jpeg`;

                await sharp(req.files.imageCover[0].buffer)
                    .resize(2000,1333)
                    .toFormate('jpeg')
                    .jpeg({ quality: 95 })
                    .toFile(`uploads/products/${imageName}`);
            
                req.body.images.push(imageName)
            })
        )
        next();
    }
});


// @desc    Get list of products
// @route   GET /api/v1/products
// access   Public
exports.getPorducts = factory.getAll(Product, 'Products');

// @desc    Get specific product by id
// @route   GET /api/v1/products/:id
// @access  Public
exports.getPorduct = factory.getOne(Product,'reviews');

// @desc    Create Product
// @route   POST /api/v1/products
// @access  Private
exports.createProduct = factory.createOne(Product);

// @desc    Update specific product
// @route   PUT /api/v1/products/:id
// @access  Private
exports.updateProduct = factory.updateOne(Product);

// @desc    Delete sepecific product
// @route   DELETE /api/v1/product/:id
// @access  Private
exports.deleteProduct = factory.deleteOne(Product);