const express = require('express');
const courseRouter = require('./routes/courseRoutes');
const userRouter = require('./routes/userRoutes');
                                      
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');
const app = express();
// app.use(express.static('public'));

// app.use(cors());
app.use(express.json());
// app.use('/uploads', express.static('uploads')); // Serve uploaded files

app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/users', userRouter);
// app.use('/api/v1/auth',authRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});          

app.use(globalErrorHandler);
       
module.exports = app;
