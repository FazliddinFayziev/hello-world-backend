const admin = require('firebase-admin');

async function uploadImageArray(images) {
    if (!images || images.length === 0) {
        return res.status(400).json({ error: 'No image file provided' });
    }

    const bucket = admin.storage().bucket();
    const filePromises = [];

    for (const file of images) {
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
    return imageUrls
}

exports.uploadImage = uploadImageArray;