const mongoose = require('mongoose');
const { Schema } = mongoose;

// ALL IMAGES SCHEMA

const bannerSchema = new Schema({

    // images
    images: {
        type: [String],
        required: true,
    },

    // text
    text: {
        type: String,
        required: true
    },

    // Link
    link: {
        type: String,
        required: true
    },

    // number
    number: {
        type: String,
        required: true
    },

    // category
    category: {
        type: String,
        required: true
    }

})

// Models
const Banner = mongoose.model("banner", bannerSchema);

// Exporting All
exports.Banner = Banner;
