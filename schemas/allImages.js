const mongoose = require('mongoose');
const { Schema } = mongoose;

// ALL IMAGES SCHEMA

const ImageSchema = new Schema({

    // all images
    allImages: {
        type: [String],
        required: true,
    }

})

// Models
const Images = mongoose.model("all images", ImageSchema);

// Exporting All
exports.Images = Images;
