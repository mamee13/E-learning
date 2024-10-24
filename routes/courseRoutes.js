const express = require('express');
const courseController = require('../controllers/courseController');
const authController = require('../controllers/authController');
const router = express.Router();
const multerUpload = require('../utils/uploadFile')
const uploadVideo = require('../utils/uploadVideo')


router.route('/')
   .get(courseController.getAllCourses)
   .post(authController.protect, authController.restrictTo('teacher'), multerUpload, courseController.createCourse);
router.route('/:id')
   .get(authController.protect, courseController.getCourse)
   .patch( authController.protect, authController.restrictTo('teacher'), courseController.updateCourse)
   .delete(authController.protect, authController.restrictTo('teacher', 'admin'), courseController.deleteCourse);

   router.post('/upload-video', uploadVideo, (req, res) => {
      // Check if a file was uploaded
      if (!req.file) {
          return res.status(400).json({ message: 'No video file uploaded.' });
      }
  
      // Respond with the uploaded file information
      res.status(200).json({
          message: 'Video uploaded successfully!',
          file: req.file,
      });
  });
  

module.exports = router;