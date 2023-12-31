// All Imports
const express = require('express');
const router = express.Router();
const multer = require("multer");
const { uploadImage } = require('../functions/image');
const { fileFilter } = require('../functions/fileFilter');
const { validateBanner } = require('../functions/validate');
const { Banner } = require("../schemas/banner");

// =======================================================>
// Get Banner ( GET )
// =======================================================>

router.get('/getbanner', async (req, res) => {

    try {

        const banner = await Banner.find()
        res.status(200).send(banner)

    } catch (error) {

        // handle error
        res.status(500).json({ error: 'There is a problem' });

    }
})


// =======================================================>
// Get Single Banner ( GET )
// =======================================================>

router.get('/getsinglebanner', async (req, res) => {
    try {

        const { bannerId } = req.query;

        // check id of product (is it valid or not ?)
        const bannerProductId = await Banner.findById(bannerId);
        if (!bannerProductId) {
            return res.status(404).send("Product ID is not found");
        }

        const banner = await Banner.findById(bannerId)
        res.status(200).send(banner)

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
// POST new Banner ( POST )
// =======================================================>

router.post('/newbanner', upload.array('images'), async (req, res) => {

    try {

        // Image Validation Error
        if (req.fileValidationError) {
            return res.status(400).json({ error: req.fileValidationError });
        }

        // check validation of product
        const { error } = validateBanner(req.body);
        if (error) {
            return res.send(error.details[0].message);
        }

        // upload image logic (funcition)
        const imageUrls = await uploadImage(req.files, res);

        // new Product
        const { text, number, link, category } = req.body;

        const banner = await new Banner({
            text,
            link,
            number,
            category,
            images: imageUrls
        })

        const readyBanner = await banner.save();
        res.send(readyBanner);

    } catch (error) {

        // handle error
        res.status(500).json({ error: 'There is a problem' });

    }

})

// =======================================================>
// EDIT Banner ( PUT )
// =======================================================>

router.put('/editbanner', upload.array('images'), async (req, res) => {

    try {

        const { bannerId } = req.query;

        // check validation of product
        const { error } = validateBanner(req.body);
        if (error) {
            return res.send(error.details[0].message);
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


        // check id of product (is it valid or not ?)
        const bannerProductId = await Banner.findById(bannerId);
        if (!bannerProductId) {
            return res.status(404).send("Product ID is not found");
        }

        // Update product data
        const updatedBannerData = {
            text: req.body.text,
            link: req.body.link,
            number: req.body.number,
            category: req.body.category,
            images: combinedImageUrls
        };

        // find id of product and update
        const banner = await Banner.findByIdAndUpdate(bannerId, updatedBannerData, { new: true });

        // save product and send
        const readyBanner = await banner.save();
        res.send(readyBanner)

    } catch (error) {

        // handle error
        res.status(500).json({ error: 'There is a problem' });

    }

})


// =======================================================>
// DELETE Banner ( DELETE )
// =======================================================>

router.delete('/deletebanner', async (req, res) => {

    try {

        const { bannerId } = req.query;

        // check id of product (is it valid or not ?)
        const bannerProductId = await Banner.findById(bannerId);
        if (!bannerProductId) {
            return res.status(404).send("Product ID is not found");
        }

        const banner = await Banner.findOneAndDelete({ _id: bannerId })

        res.status(200).send(banner)

    } catch (error) {

        // handle error
        res.status(500).json({ error: 'There is a problem' });

    }


})

// All Exports

module.exports = router; 