
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

// =======================================================>
// POST Card Items( POST )
// =======================================================>

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


router.delete('/deletecard', async (req, res) => {

    try {

        const { cardId } = req.query;

        // check id of product (is it valid or not ?)
        const CardItemId = await Card.findById(cardId);
        if (!CardItemId) {
            return res.status(404).send("Card ID is not found");
        }

        const product = await Card.findOneAndDelete(cardId)

        res.status(200).send(product)

    } catch (error) {

        // handle error
        res.status(500).json({ error: 'There is a problem' });

    }

})

module.exports = router;


