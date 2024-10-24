const mongoose = require('mongoose');
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    message: 'Please enter the course title',
  },
  description: {
    type: String,
    required: true,
    message: 'Please enter the course description',
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  price: {
    type: Number,
    required: false,
    default: 0,
  },
  videos:[],
  createdAt: {
    type: Date,
    default: Date.now,
  },
},
  {
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    }
  });

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;