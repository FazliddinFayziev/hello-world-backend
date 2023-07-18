
const { Card } = require('../schemas/card');
const express = require('express');
const { validateCard } = require('../functions/validate');
const router = express.Router();



// =======================================================>
// Get Card Items( GET )
// =======================================================>

router.get('/getcard', async (req, res) => {
    try {

        const card = await Card.find()
        res.status(200).send(card)

    } catch (error) {

        // handle error
        res.status(500).json({ error: 'There is a problem' });

    }
})


router.post('/postcard', async (req, res) => {

    try {

        // check validation of product
        const { error } = validateCard(req.body);
        if (error) {
            return res.send(error.details[0].message);
        }

        const { cardItems, totalPrice, userInfo: { userName, phoneNumber, avenue, address } } = req.body;

        const card = new Card({
            cardItems,
            totalPrice,
            userInfo: {
                userName,
                phoneNumber,
                avenue,
                address
            }
        });

        const readyCard = await card.save();
        res.status(200).send(readyCard);

    } catch (error) {

        // handle error
        res.status(500).json({ error: 'There is a problem' });
        console.log(error)

    }
})

module.exports = router;


