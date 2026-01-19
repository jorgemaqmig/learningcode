const express = require('express');
const router = express.Router();
const executionController = require('../controllers/executionController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to execute code
// Protected route: requires authentication
router.post('/execute', authMiddleware, executionController.executeCode);

module.exports = router;
