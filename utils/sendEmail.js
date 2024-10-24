const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const sgmail = require('@sendgrid/mail');
sgmail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (email, link) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'verfiy your account',
        text: `Welcome`,
        text: link

};

try {
    await sgmail.send(mailOptions);
    console.log('OTP sent successfully');
} catch (error) {
    console.error('Error sending OTP:', error);
}
};

module.exports = sendEmail;
