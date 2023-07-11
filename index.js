const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
const app = express();
const admin = require('firebase-admin');
const { Product } = require('./schemas/products');
const { validateProduct } = require('./validate');
const multer = require('multer');
const serviceAccount = require('./AccountKey.json');

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
    .connect('mongodb+srv://fazliddin:ZmFmRf4515@cluster0.soswtmt.mongodb.net/products?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Database is connected well'))
    .catch((err) => console.log(`There is a problem: ${err}`));

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://hello-world-90e4a.appspot.com',
});

// Configure Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/upload', upload.array('images'), async (req, res) => {
    try {

        // check validation of product
        const { error } = validateProduct(req.body);
        if (error) {
            return res.send(error.details[0].message);
        }

        // check files, is it uploaded?
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        const bucket = admin.storage().bucket();
        const filePromises = [];

        for (const file of req.files) {
            const readyFile = bucket.file(file.originalname);
            const fileStream = readyFile.createWriteStream({
                metadata: {
                    contentType: file.mimetype,
                },
            });

            const filePromise = new Promise((resolve, reject) => {
                fileStream.on('error', (err) => {
                    console.error(err);
                    reject(err);
                });

                fileStream.on('finish', () => {
                    readyFile.makePublic()
                        .then(() => {
                            const imageUrl = `https://storage.googleapis.com/${bucket.name}/${readyFile.name}`;
                            resolve(imageUrl);
                        })
                        .catch((err) => {
                            console.error(err);
                            reject(err);
                        });
                });

                fileStream.end(file.buffer);
            });

            filePromises.push(filePromise);
        }

        const imageUrls = await Promise.all(filePromises);
        const { name, category, price, descuz, descru, desceng, size, image } = req.body;
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

app.listen(3000, function () {
    console.log('Server is running on port 3000');
});
