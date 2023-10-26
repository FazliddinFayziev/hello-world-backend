
// All Imports
const express = require('express');
const router = express.Router();
const { Product } = require('../schemas/products');
const { validateProduct } = require('../functions/validate');
const { uploadImage } = require('../functions/image');
const { fileFilter } = require('../functions/fileFilter');
const multer = require('multer');
const { Card } = require('../schemas/card');
const { getLastWeekOrders, getWeeklyOrderCounts, categorizeOrdersIntoWeeks } = require('../functions/functions');


// =======================================================>
// Get Dashboard ( GET )
// =======================================================>
router.get('/dashboard', async (req, res) => {
    try {

        const products = await Product.find()
        const card = await Card.find()

        const dashboard = {
            allProducts: products.length,
            allOrders: card.length,
            lastweekOrders: getLastWeekOrders(card).length,
            getWeeklyOrders: getWeeklyOrderCounts(card),
            getMonthlyOrders: categorizeOrdersIntoWeeks(card)
        }

        res.send(dashboard)

    } catch (error) {

        // handle error
        res.status(500).json({ error: 'Failed to retrieve products' });

    }
})


// =======================================================>
// Get All needed products ( GET )
// =======================================================>


router.get('/', async (req, res) => {
    try {
        // get products and sort products
        const products = await Product.find().sort({ _id: -1 });

        // get and structure needed products
        const formattedProducts = products.map((product) => {
            return {
                id: product.id,
                name: product.name,
                category: product.category,
                price: product.price,
                colors: product.colors,
                images: product.images[0],
                option: product.option
            };
        });

        // send product
        res.send(formattedProducts);
    } catch (error) {
        // handle error
        res.status(500).json({ error: 'Failed to retrieve products' });
    }
});



// =======================================================>
// Get Single needed products ( GET SINGLE )
// =======================================================>

router.get('/single', async (req, res) => {

    try {

        // get single Product Id from query
        const { singleId } = req.query

        // Check validation of Single Product
        const product = await Product.findById(singleId)
        if (!product) return res.status(404).send("Invatid Product ID. There is no such product ID")

        // Send found product
        res.status(200).send(product)

    } catch (error) {

        // handle error
        res.status(500).json({ error: 'There is a problem' });

    }

})

// Configure Multer =================>

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// =======================================================>
// Post Single product ( POST )
// =======================================================>

router.post('/upload', upload.array('images'), async (req, res) => {

    try {

        // Image Validation Error
        if (req.fileValidationError) {
            return res.status(400).json({ error: req.fileValidationError });
        }

        // check validation of product
        const { error } = validateProduct(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        // Extract image URLs from request body
        const imageUrls = req.body.imageUrls || [];

        // Validate image URLs
        const isValidImageUrls = imageUrls.every(url => url.startsWith("https://storage.googleapis.com"));

        if (!isValidImageUrls) {
            return res.status(400).json({ error: "Invalid image URLs format" });
        }

        // Upload image logic (function) for file uploads
        const fileImageUrls = await uploadImage(req.files, res);

        // Combine the file image URLs with the provided URLs
        const combinedImageUrls = [...imageUrls, ...fileImageUrls];

        // Check if there are no images uploaded
        if (combinedImageUrls.length === 0) {
            return res.status(400).json({ error: "Please upload at least one image" });
        }

        // new Product
        const { name, category, price, colors, option, descuz, descru, desceng, size } = req.body;
        const product = new Product({
            name,
            category,
            price,
            colors,
            option,
            descuz,
            descru,
            desceng,
            size,
            images: combinedImageUrls
        });

        // save and send product
        const savedProduct = await product.save();
        res.status(200).send(savedProduct);

    } catch (error) {

        // handle error
        console.log(error);
        res.status(500).json({ error: 'There is a problem' });

    }

});

// =======================================================>
// Edit Single Product ( PUT )
// =======================================================>

router.put('/edit', upload.array('images'), async (req, res) => {
    try {
        // Get id from query
        const { id } = req.query;

        // Validate product data
        const { error } = validateProduct(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        // Extract image URLs from request body
        const imageUrls = req.body.imageUrls || [];

        // Validate image URLs
        const isValidImageUrls = imageUrls.every(url => url.startsWith("https://storage.googleapis.com"));
        if (!isValidImageUrls) {
            return res.status(400).send("Invalid image URLs format");
        }

        // Upload image logic (function) for file uploads
        let fileImageUrls = [];
        if (req.files && req.files.length > 0) {
            fileImageUrls = await uploadImage(req.files, res);
        }

        // Combine the file image URLs with the provided URLs
        const combinedImageUrls = [...imageUrls, ...fileImageUrls];

        // Check if product ID is valid
        const productId = await Product.findById(id);
        if (!productId) {
            return res.status(404).send("Product ID is not found");
        }

        // Update product data
        const updatedProductData = {
            name: req.body.name,
            category: req.body.category,
            price: req.body.price,
            colors: req.body.colors,
            option: req.body.option,
            descuz: req.body.descuz,
            descru: req.body.descru,
            desceng: req.body.desceng,
            size: req.body.size,
            images: combinedImageUrls
        };

        // Update the product
        const updatedProduct = await Product.findByIdAndUpdate(id, updatedProductData, { new: true });


        // Send the updated product
        const updatedReadyProduct = await updatedProduct.save();

        // Send the updated product
        res.send(updatedReadyProduct);

    } catch (error) {
        // Handle error
        console.error(error);
        res.status(500).json({ error: 'There is a problem' });
    }
});



// =======================================================>
// Delete Single Product ( DELETE )
// =======================================================>

router.delete('/delete', async (req, res) => {

    try {

        const { deleteId } = req.query

        // check id of product (is it valid or not ?)
        const productId = await Product.findById(deleteId);
        if (!productId) {
            return res.status(404).send("Product ID is not found");
        }

        const product = await Product.findOneAndDelete({ _id: deleteId })

        res.status(200).send(product)

    } catch (error) {

        // handle error
        res.status(500).json({ error: 'There is a problem' });

    }

})

module.exports = router; 