// utils/uploadVideo.js
const path = require('path');
const multer = require('multer');

// Define allowed video types
const allowedVideoTypes = ['video/mp4', 'video/avi', 'video/mkv' ];

// Set up storage for video files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads')); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`); // Use timestamp for unique filename
  },
});

// Initialize multer for video uploads
const uploadVideo = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (allowedVideoTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 500, // 500MB limit
  },
});

// Export the multer instance for handling single video file uploads
module.exports = uploadVideo.single('video'); // Expecting 'video' as the field name
