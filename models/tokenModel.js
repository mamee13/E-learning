const mongoose = require('mongoose');

const otpTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const OtpToken = mongoose.model('OtpToken', otpTokenSchema);

module.exports = OtpToken;