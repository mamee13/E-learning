const express = require('express');
const courseController = require('../controllers/courseController');
const authController = require('../controllers/authController');
const router = express.Router();

router.route('/')
   .get(courseController.getAllCourses)
   .post(authController.protect, authController.restrictTo('teacher'), courseController.createCourse);
router.route('/:id')
   .get(authController.protect, courseController.getCourse)
   .patch( authController.protect, authController.restrictTo('teacher'), courseController.updateCourse)
   .delete(authController.protect, authController.restrictTo('teacher', 'admin'), courseController.deleteCourse);

module.exports = router;