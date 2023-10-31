const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const admin = require('firebase-admin');
const serviceAccount = require('./AccountKey.json');
const products = require("./router/products");
const notes = require("./router/notes");
const banner = require("./router/banner");
const card = require("./router/card");
const user = require("./router/user");
const qrcode = require("./router/qrcode");
const { deleteUnusedImages } = require('./functions/deleteImages')


dotenv.config();
app.use(express.json());
const whitelist = ['https://hw.com.uz', 'https://admin.hw.com.uz']; // allowed origins

const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};

app.use(cors(corsOptions));

// Connect to MongoDB
mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Database is connected well'))
    .catch((err) => console.log(`There is a problem: ${err}`));

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.STORAGE_BUCKET,
});

// Main item

app.use('/api/v1', products);
app.use('/api/v1', banner);
app.use('/api/v1', qrcode);
app.use('/api/v1', notes);
app.use('/api/v1', card);
app.use('/api/v1', user);


// Check and delete Function(once in a week)
setInterval(deleteUnusedImages, 7 * 24 * 60 * 60 * 1000); // 7 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds



app.listen(3000, function () {
    console.log('Server is running on port 3000');
});
