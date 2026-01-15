const express = require('express');
const router = express.Router();
const CourseController = require('../controllers/courseController');
const ProgressModel = require('../models/progressModel'); 

router.get('/', CourseController.getAllCourses);
router.get('/:id/sections', CourseController.getCourseSections);
router.get('/:id', CourseController.getCourseById);
router.get('/users/:userId/courses/:courseId/sections', async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    const completedSections = await ProgressModel.getCompletedSectionsForCourse(userId, courseId);
    res.json(completedSections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;