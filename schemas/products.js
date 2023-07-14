const mongoose = require("mongoose");

const { Schema } = mongoose;

// SCHEMA PRODUCT

const productSchema = new Schema({
    // Name
    name: {
        type: String,
        required: true,
    },

    // Category
    category: {
        type: String,
        required: true,
    },

    // Price
    price: {
        type: Number,
        required: true,
    },

    // desc uz
    descuz: {
        type: String,
        required: true,
    },

    // desc ru
    descru: {
        type: String,
        required: true,
    },

    // desc ru
    desceng: {
        type: String,
        required: true,
    },

    // size
    size: {
        type: Array,
        required: true,
    },

    // image
    images: {
        type: [String],
        required: true,
    },
});

const Product = mongoose.model('Shirts', productSchema);
exports.Product = Product;

