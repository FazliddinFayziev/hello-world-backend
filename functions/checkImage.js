const admin = require('firebase-admin');

// Function to check and delete images
async function checkAndDeleteImages() {
    try {
        const bucket = admin.storage().bucket();

        const [files] = await bucket.getFiles();

        const imageURLs = files.map((file) => {
            const imageURL = `gs://${file.bucket.name}/${file.name}`;
            return imageURL;
        });

        return imageURLs;
    } catch (error) {
        console.error('Error occurred:', error);
        throw error;
    }
}

exports.checkAndDeleteImages = checkAndDeleteImages;
