const express = require('express');
const mongoose = require('mongoose');
const { Product } = require('./models/products');
const app = express()
const port = 3000

mongoose.connect("mongodb+srv://fazliddin:ZmFmRf4515@cluster0.soswtmt.mongodb.net/products?retryWrites=true&w=majority")
    .then(() => console.log("Database is connected well"))
    .catch((err) => console.log(`There is a problem: ${err}`))

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello World")
})

app.post("/product", async (req, res) => {
    try {
        const { title } = req.body
        const product = new Product({ title })
        const savedProduct = await product.save();
        res.status(200).send(savedProduct)
    } catch (error) {
        console.log("Error:", error)
        res.status(500).send("There is an error with status 500")
    }
})

app.listen(port, () => console.log(`Server is listening port in http://localhost:${port}`))