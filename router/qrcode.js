const express = require('express');
const { QrCode } = require('../schemas/qrcode');
const { validateQRCode } = require('../functions/validate');
const router = express.Router();

// =======================================================>
// Get QRCODE ( GET )
// =======================================================>


router.get('/qrcode', async (req, res) => {

    try {

        const qrcodes = await QrCode.find()

        // get and structure needed products
        const formattedQrCodes = qrcodes.map((qrcode) => {
            return {
                id: qrcode._id,
                logo: qrcode.logoLetter,
                text: qrcode.text
            };
        });

        res.status(200).send(formattedQrCodes)

    } catch (error) {

        // handle error
        res.status(500).json({ error: 'There is a problem' });

    }
})


// =======================================================>
// Get Single needed QRCODE ( GET SINGLE )
// =======================================================>

router.get('/singleqrcode', async (req, res) => {

    try {

        // get single Product Id from query
        const { qrId } = req.query

        // Check validation of Single Product
        const qrcode = await QrCode.findById(qrId)
        if (!qrcode) return res.status(404).send("Invatid qrcode ID. There is no such qrcode ID")

        // Find qrcode by ID
        const singleQRCode = await QrCode.findById(qrId)

        // Send found product
        res.status(200).send(singleQRCode)

    } catch (error) {

        // handle error
        res.status(500).json({ error: 'There is a problem' });

    }

})


// =======================================================>
// POST SINGLE QRCODE( POST )
// =======================================================>

router.post('/qrcode', async (req, res) => {

    try {

        // check validation of product
        const { error } = validateQRCode(req.body);
        if (error) {
            return res.send(error.details[0].message);
        }

        const { logoLetter, text, smallText, icons: { instagram, telegram, facebook, youtube, twitter, github, linkedIn, website } } = req.body;

        const qrcode = new QrCode({
            logoLetter,
            text,
            smallText,
            icons: {
                instagram,
                telegram,
                facebook,
                twitter,
                github,
                linkedIn,
                website,
                youtube
            }
        });

        const readyQRCode = await qrcode.save();
        res.status(200).send(readyQRCode);

    } catch (error) {

        res.status(500).json({ error: 'There is a problem' });
        console.log(error)

    }
})


// All Exports

module.exports = router; 