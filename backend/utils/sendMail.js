// utils/sendMail.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const sendMail = async ({ email, subject, message }) => {
  console.log('📨 sendMail called with:', email, subject); // Debug: log inputs

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS, // App password from Gmail, not actual password
      },
      debug: true, // Enable SMTP debug logs
    });

    // Verify the connection config
    await transporter.verify();
    console.log('✅ Transporter is ready to send emails');

    const mailOptions = {
      from: `"Admin Support" <${process.env.MAIL_USER}>`,
      to: email,
      subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully to:', email);
  } catch (err) {
    console.error('❌ Failed to send email:', err);
    throw new Error('Email sending failed');
  }
};

export default sendMail;
