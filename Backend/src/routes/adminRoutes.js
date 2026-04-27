// const express = require('express');
// const router = express.Router();
// const adminController = require('../controllers/adminController');
// const { checkRole } = require('../middlewares/authMiddleware'); // Role check middleware
// const { getEmergencyInsight } = require('./controllers/geminiController');

// router.post('/trigger', checkRole('admin'), adminController.triggerEmergency);
// router.post('/clear', checkRole('admin'), adminController.clearEmergency);
// router.post('/get-ai-insight', getEmergencyInsight);

// module.exports = router;

const express = require('express');
const router = express.Router();
// Fix 1: plural name match karein
const adminController = require('../controllers/adminControllers'); 
const { checkRole } = require('../middlewares/authMiddleware'); 
// Fix 2: ek folder piche jaakar controllers mein dekhein
const { getEmergencyInsight } = require('../controllers/geminiController'); 

router.post('/trigger', checkRole('admin'), adminController.triggerEmergency);
router.post('/clear', checkRole('admin'), adminController.clearEmergency);
router.post('/get-ai-insight', getEmergencyInsight);
router.post('/trigger-dispatch', getEmergencyInsight); // New route for dispatch

module.exports = router;