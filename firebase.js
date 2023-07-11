const admin = require('firebase-admin');
const multer = require('multer');
const path = require('path');
const serviceAccount = require('./AccountKey.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://hello-world-90e4a.appspot.com',
});

// Configure Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Upload image to Firebase Storage
function uploadImage(req, res, next) {
    upload.single('image')(req, res, function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to upload image' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        const bucket = admin.storage().bucket();
        const file = bucket.file(req.file.originalname);

        const fileStream = file.createWriteStream({
            metadata: {
                contentType: req.file.mimetype,
            },
        });

        fileStream.on('error', function (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to upload image' });
        });

        fileStream.on('finish', function () {
            file.makePublic().then(() => {
                const imageUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
                return res.status(200).json({ imageUrl: imageUrl });
            });
        });

        fileStream.end(req.file.buffer);
    });
}

module.exports = uploadImage;
