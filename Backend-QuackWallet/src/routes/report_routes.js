const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report_controller');

router.get('/:userId', reportController.getReport);

module.exports = router;
