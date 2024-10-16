const catchAsync = require('../utils/catchAsync');
const Course = require('../models/courseModel');
const AppError = require('../utils/AppError');

exports.createCourse = async (req, res, next) => {
    const data = await Course.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            data
        }
    })

}

exports.getAllCourses = catchAsync(async (req, res, next) => {
    const data = await Course.find();

    if (!data) {
        return next(new AppError('No courses found', 404))
    }

    res.status(200).json({
        status: 'success',
        data: {
            courses: data
        }
    })
})

exports.getCourse = catchAsync(async (req, res, next) => {
    const data = await Course.findById(req.params.id);

    if (!data) {
        return next(new AppError('No course found with that id', 404))
    }

    res.status(200).json({
        status: 'success',
        data: {
            course: data
        }
    })
})

exports.updateCourse = catchAsync(async (req, res, next) => {
    const data = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!data) {
        return next(new AppError('No course found with that id', 404))
    }

    res.status(200).json({
        status: 'success',
        data: {
            course: data
        }
    })
})

exports.deleteCourse = catchAsync(async (req, res, next) => {
    const data = await Course.findByIdAndDelete(req.params.id);

    if (!data) {
        return next(new AppError('No course found with that id', 404))
    }

    res.status(204).json({
        status: 'success',
        data: null
    })
})