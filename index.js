const express = require('express');
const mongoose = require('mongoose');
const { Product } = require('./schemas/products');
const { validateProduct } = require('./validate');
const app = express();
const port = 3000;

mongoose.connect("mongodb+srv://fazliddin:ZmFmRf4515@cluster0.soswtmt.mongodb.net/products?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Database is connected well"))
    .catch((err) => console.log(`There is a problem: ${err}`));

app.use(express.json());


app.get('/', (req, res) => {
    res.send("Hello World");
});

app.post("/product", async (req, res) => {
    try {

        const { error, value } = validateProduct(req.body);
        if (error) {
            return res.send(error.details[0].message);
        }

        const { name, category, price, descuz, descru, desceng, size, image } = req.body;
        const product = new Product({
            name,
            category,
            price,
            descuz,
            descru,
            desceng,
            size,
            image
        });

        const savedProduct = await product.save();
        res.status(200).send(savedProduct);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send("There is an error with status 500");
    }
});


app.listen(port, () => console.log(`Server is listening on port http://localhost:${port}`));
