const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('./ffd-5797d-firebase-adminsdk-luedg-f7424de237.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://ffd-5797d-default-rtdb.europe-west1.firebasedatabase.app/'
});

module.exports = admin;
