const express = require('express');
const mongoose = require('mongoose');
const { Product } = require('./schemas/products');
const { validateProduct } = require('./validate');
const cors = require('cors');
const multer = require('multer');
const admin = require('firebase-admin');
const serviceAccount = require('./AccountKey.json');

const app = express();
const port = 3000;

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'hello-world-90e4a.appspot.com',
});

const bucket = admin.storage().bucket();

// Connect to MongoDB
mongoose
    .connect('mongodb+srv://fazliddin:ZmFmRf4515@cluster0.soswtmt.mongodb.net/products?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Database is connected well'))
    .catch((err) => console.log(`There is a problem: ${err}`));

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/product', upload.single('image'), async (req, res) => {
    try {
        const { error } = validateProduct(req.body);
        if (error) {
            return res.send(error.details[0].message);
        }

        const { name, category, price, descuz, descru, desceng, size, image } = req.body;

        // Upload the image to Firebase Storage
        const imageFile = req.file;
        const uploadedFile = await bucket.upload(imageFile.buffer, {
            metadata: {
                contentType: imageFile.mimetype,
            },
        });

        // Get the public URL of the uploaded file
        const imageUrl = await uploadedFile[0].getSignedUrl({
            action: 'read',
            expires: '03-01-2500', // Set the expiration date as desired
        });

        const product = new Product({
            name,
            category,
            price,
            descuz,
            descru,
            desceng,
            size,
            image: imageUrl
        });

        const savedProduct = await product.save();
        res.status(200).send(savedProduct);
    } catch (error) {
        console.log('Error:', error);
        res.status(500).send('There is an error with status 500');
    }
});

app.listen(port, () => console.log(`Server is listening on port http://localhost:${port}`));
