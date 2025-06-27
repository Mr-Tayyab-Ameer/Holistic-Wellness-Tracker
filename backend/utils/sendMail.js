// utils/sendMail.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const sendMail = async ({ email, subject, message }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS, // App password, not your actual Gmail password
      },
    });

    const mailOptions = {
      from: `"Admin Support" <${process.env.MAIL_USER}>`,
      to: email,
      subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (err) {
    console.error('Failed to send email:', err);
    throw new Error('Email sending failed');
  }
};

export default sendMail;
