const mongoose = require('mongoose')

const subCategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            unique: [true, 'SubCategory must be unique'],
            minlength: [2, 'Too short subCategory name'],
            maxlength: [32, 'Too long subCategory name'],
        },
        slug: {
            type: String,
            lowercase: true,
        },
        category: {
            type: mongoose.Schema.ObjectId,
            ref: 'Category',
            required: [true, 'SubCategory must belong to parent category'],
        },
    },
    { timestamps: trie }
);

const SubCategory = mongoose.model('SubCategory',subCategorySchema);
module.exports = SubCategory;