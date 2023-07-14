const admin = require('firebase-admin');
const { firebaseImages, mongoDbImages, findUnusedImages, deleteImagesFromFirebase } = require('./checkImage');


// =======================================================>
// Get All Images of All Products in the form of Array ( GET )
// =======================================================>
async function deleteUnusedImages() {
    try {

        // Getting access to Firebase Storage
        const bucket = admin.storage().bucket();

        // functions that are getting the value of image urls from MongoDb and Firebase Storage
        const firebase = await firebaseImages(bucket);
        const mongoDb = await mongoDbImages();
        const result = await findUnusedImages(firebase, mongoDb);

        const deletedProducts = await deleteImagesFromFirebase(bucket, result)

        return deletedProducts

    } catch (error) {
        console.error('Error retrieving file URLs:', error);
    }
}

exports.deleteUnusedImages = deleteUnusedImages