

// const admin = require('../config/firebase-admin');

// exports.signup = async (req, res) => {
//   const { email, password, role, name, roleType, jobTitle, currentAssignment } = req.body;

//   try {
//     const userRecord = await admin.auth().createUser({
//       email,
//       password,
//       displayName: name,
//       role,
//       roleType,
//       jobTitle,
//       currentAssignment,
//     });

//     // SET CUSTOM ROLE (This is the most important part!)
//     await admin.auth().setCustomUserClaims(userRecord.uid, { role: role });

    

//     res.status(201).json({ message: `User created successfully as ${role}`,uid: userRecord.uid });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

const admin = require('../config/firebase-admin');

exports.signup = async (req, res) => {
  const { email, password, role, name, roleType, jobTitle, currentAssignment } = req.body;

  try {
    // 1. Firebase Auth User Create karein (Sirf standard fields)
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    // 2. Custom Claims (Role) set karein - Auth Token mein role inject karne ke liye
    await admin.auth().setCustomUserClaims(userRecord.uid, { role: role });

    // 3. Firestore mein User ka detailed document banayein
    // Ye Admin Directory aur Safety Map ke liye zaroori hai
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      name: name,
      email: email,
      role: role,         // e.g., 'staff' ya 'guest'
      roleType: roleType || 'user', 
      jobTitle: jobTitle || "Field Staff",
      currentAssignment: currentAssignment || { floor: "-", sector: "-", taskType: "Waiting..." },
      status: role === 'staff' ? "on-duty" : "checked-in",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      isVerified: false
    });

    // Success Response
    return res.status(201).json({ 
      message: `User created successfully as ${role}`,
      uid: userRecord.uid 
    });

  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(400).json({ error: error.message });
  }
};