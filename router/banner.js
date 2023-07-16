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

router.get('/getbanner', (req, res) => {
    res.send("Hello Banner")
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
        const { text, number, category } = req.body;

        const banner = await new Banner({
            text,
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

    const { bannerId } = req.query;

    // check validation of product
    const { error } = validateBanner(req.body);
    if (error) {
        return res.send(error.details[0].message);
    }

    // upload image logic (function)
    const imageUrls = await uploadImage(req.files, res);

    // check id of product (is it valid or not ?)
    const bannerProductId = await Banner.findById(bannerId);
    if (!bannerProductId) {
        return res.status(404).send("Product ID is not found");
    }

    // find id of product and update
    const banner = await Banner.findByIdAndUpdate(bannerId, {
        text: req.body.text,
        number: req.body.number,
        category: req.body.category,
        images: imageUrls
    }, { new: true });

    // save product and send
    banner.save();
    res.send(banner)

})

// All Exports

module.exports = router; 