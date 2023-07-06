const mongoose = require("mongoose");

const { Schema } = mongoose

const productShema = new Schema({
    title: String,
});

exports.productShema = productShema