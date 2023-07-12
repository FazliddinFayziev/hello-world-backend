const admin = require('firebase-admin');
const serviceAccount = require('./AccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://hello-world-90e4a.appspot.com',
});


