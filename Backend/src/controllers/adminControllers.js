const admin = require('../config/firebase-admin');
const db = admin.firestore();

// 1. Trigger Global Emergency
exports.triggerEmergency = async (req, res) => {
    const { type, message } = req.body;
    try {
        await db.collection('emergency_status').doc('current').set({
            isActive: true,
            type: type || 'FIRE',
            message: message || 'Please evacuate immediately!',
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        res.status(200).json({ message: "Emergency Mode Activated Everywhere!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Clear Emergency
exports.clearEmergency = async (req, res) => {
    try {
        await db.collection('emergency_status').doc('current').update({
            isActive: false,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        res.status(200).json({ message: "All Clear signal sent." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};