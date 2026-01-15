const express = require('express');
const router = express.Router();
const ProgressController = require('../controllers/progressController');

// Rutas para el progreso de secciones
router.post('/users/:userId/courses/:courseId/sections/:sectionId/complete', ProgressController.markSectionComplete);
router.delete('/users/:userId/courses/:courseId/sections/:sectionId/complete', ProgressController.unmarkSectionComplete);

// Rutas para el progreso general del curso
router.get('/users/:userId/courses/:courseId/progress', ProgressController.getCourseProgress);
router.get('/users/:userId/progress', ProgressController.getAllUserProgress);

module.exports = router;