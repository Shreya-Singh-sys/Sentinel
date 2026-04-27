// const admin = require('../../../Frontend/src/config/firebase'); // Your firebase-admin config

// exports.signup = async (req, res) => {
//   const { email, password, role, fullName } = req.body;

//   try {
//     // 1. Create User in Firebase Auth
//     const userRecord = await admin.auth().createUser({
//       email,
//       password,
//       displayName: fullName,
//     });

//     // 2. Set Custom Role (Guest, Staff, or Admin)
//     await admin.auth().setCustomUserClaims(userRecord.uid, { role: role });

//     // 3. (Optional) Save extra info in Firestore
//     await admin.firestore().collection('users').doc(userRecord.uid).set({
//       fullName,
//       email,
//       role,
//       createdAt: new Date(),
//     });

//     res.status(201).send({ message: `User created as ${role}` });
//   } catch (error) {
//     res.status(400).send({ error: error.message });
//   }
// };

const admin = require('../config/firebase-admin');

exports.signup = async (req, res) => {
  const { email, password, role, fullName } = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: fullName,
    });

    // SET CUSTOM ROLE (This is the most important part!)
    await admin.auth().setCustomUserClaims(userRecord.uid, { role: role });

    res.status(201).json({ message: `User created successfully as ${role}` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};