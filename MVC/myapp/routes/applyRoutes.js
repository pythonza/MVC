const express = require('express');
const router = express.Router();
const applyController = require('../controllers/applyController');

router.get('/:jobId', applyController.showApplyForm);
router.post('/:jobId', applyController.submitApplication);

module.exports = router;
