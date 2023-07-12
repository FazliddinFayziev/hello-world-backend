const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
const app = express();
const admin = require('firebase-admin');
const serviceAccount = require('./AccountKey.json');
const products = require("./router/products");

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

// Main item

app.use('/api/v1', products);


app.listen(3000, function () {
    console.log('Server is running on port 3000');
});
