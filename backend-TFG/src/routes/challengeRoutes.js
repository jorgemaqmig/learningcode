// backend-TFG/src/routes/challenge.js
const express = require('express');
const router = express.Router();
const challengeController = require('../controllers/challengeController');

// Ruta para obtener todos los retos
router.get('/', challengeController.getAllChallenges);

// Ruta para obtener un reto por ID
router.get('/:id', challengeController.getChallengeById);

module.exports = router;