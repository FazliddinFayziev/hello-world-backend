const mongoose = require('mongoose');
const { productShema } = require('../schemas/products');

const Product = mongoose.model('Shirts', productShema);

exports.Product = Product