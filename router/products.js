const express = require('express');
const router = express.Router();
const { Product } = require('../schemas/products');
const { validateProduct } = require('../functions/validate');
const { uploadImage } = require('../functions/image');
const multer = require('multer');

router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        const formattedProducts = products.map((product) => {
            return {
                name: product.name,
                category: product.category,
                price: product.price,
                images: product.images[0]
            };
        });

        res.send(formattedProducts);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to retrieve products' });
    }
})


// Configure Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', upload.array('images'), async (req, res) => {
    try {

        // check validation of product
        const { error } = validateProduct(req.body);
        if (error) {
            return res.send(error.details[0].message);
        }

        // check files, is it uploaded?
        const imageUrls = await uploadImage(req.files);

        const { name, category, price, descuz, descru, desceng, size } = req.body;
        const product = new Product({
            name,
            category,
            price,
            descuz,
            descru,
            desceng,
            size,
            images: imageUrls
        });

        const savedProduct = await product.save();
        res.status(200).send(savedProduct);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to upload images' });
    }
});

module.exports = router; 