const admin = require('firebase-admin');
const serviceAccount = require('./crisis-simulator-ecc1b-firebase-adminsdk.json'); // Check name exactly

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;