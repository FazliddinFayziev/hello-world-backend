
const { Card } = require('../schemas/card');
const express = require('express');
const { validateCard } = require('../functions/validate');
const { formatCurrentTime } = require('../functions/functions');
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

        const { cardItems, totalPrice, time, userInfo: { userName, phoneNumber, avenue, address } } = req.body;

        const card = new Card({
            cardItems,
            totalPrice,
            time: formatCurrentTime(),
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

        res.status(500).json({ error: 'There is a problem' });
        console.log(error)

    }
})


// =======================================================>
// UPDATE Card Items( DELETE )
// =======================================================>


router.put('/updatecart', async (req, res) => {
    try {
        const { cardId } = req.query;

        // Check if the cardId is valid
        const cardItem = await Card.findById(cardId);
        if (!cardItem) {
            return res.status(404).send("Card ID is not found");
        }

        cardItem.shipped = !cardItem.shipped;
        const updatedProduct = await cardItem.save();

        res.status(200).send(updatedProduct);
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: 'There is a problem' });
    }
});



// =======================================================>
// DELETE Card Items( DELETE )
// =======================================================>


router.delete('/deletecard', async (req, res) => {

    try {

        const { cardId } = req.query;

        // check id of product (is it valid or not ?)
        const CardItemId = await Card.findById(cardId);
        if (!CardItemId) {
            return res.status(404).send("Card ID is not found");
        }

        const product = await Card.findOneAndDelete({ _id: cardId })

        res.status(200).send(product)

    } catch (error) {

        // handle error
        res.status(500).json({ error: 'There is a problem' });

    }

})

module.exports = router;


