const mongoose = require('mongoose')

// Create Schema
const brandSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Brand required'],
            unique: [true, 'Brand must be unique'],
            minlength: [3,'Too short Brand name'],
            maxlength: [32,'Too long Brand name']
        },
        slug: {
            type: String,
            lowercase: true,
        },
        image: String,
    },
    { timestamps: true }
);

const setImageUrl = (doc) => {
    if (doc.image) {
        const imageUrl = `BASE_URL/brands/${doc.image}`;
        doc.image = imageUrl;
    }
}

// findOne, findAll and update
brandSchema.post('init', (doc) => {
    setImageUrl(doc);
});

// create
brandSchema.post('save',(doc) => {
    setImageUrl(doc);
});

// 2- create model
const Brand = mongoose.model('Brand',brandSchema);
module.exports = Brand;