const { Product } = require('../schemas/products');



// =================================================>
// =============== FUNCTION 1 ======================>
// =================================================>

// Function to TARGET THE URL OF IMAGE ON THE FIREBASE

async function firebaseImages(bucket) {
    const [files] = await bucket.getFiles();
    const fileURLs = files.map(file => {
        return `https://storage.googleapis.com/${bucket.name}/${file.name}`;
    });
    return fileURLs;
}


// =================================================>
// =============== FUNCTION 2 ======================>
// =================================================>

// Function to TARGET THE URL OF IMAGE of PRODUCT ON THE MONGODB 

async function mongoDbImages() {
    const products = await Product.find();
    const producImagesSet = new Set();

    for (let product of products) {
        for (let image of product.images) {
            producImagesSet.add(image);
        }
    }

    const producImagesArray = Array.from(producImagesSet);
    return producImagesArray;
}


// =================================================>
// =============== FUNCTION 3 ======================>
// =================================================>

// Funtion to find images that are not being used

function findUnusedImages(firstArray, secondArray) {
    const firstSet = new Set(secondArray);
    console.log(firstSet)
    const resultArray = firstArray.filter(element => !firstSet.has(element));
    const cleanedResult = resultArray.map(url => url.replace('https://storage.googleapis.com/hello-world-90e4a.appspot.com/', ''));
    return cleanedResult;
}


// =================================================>
// =============== FUNCTION 4 ======================>
// =================================================>

// Delete my images from firebase (function)

async function deleteImagesFromFirebase(bucket, urls) {
    try {
        const deletePromises = urls.map(async url => {
            const file = bucket.file(url);
            await file.delete();
        });

        await Promise.all(deletePromises);
        console.log('Images deleted successfully from Firebase Storage');
    } catch (error) {
        console.error('Error deleting images from Firebase Storage:', error);
        throw error;
    }
}


exports.mongoDbImages = mongoDbImages;
exports.firebaseImages = firebaseImages;
exports.findUnusedImages = findUnusedImages;
exports.deleteImagesFromFirebase = deleteImagesFromFirebase;

