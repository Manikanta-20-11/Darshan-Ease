const nodemailer = require('nodemailer');

let transporter = null;

const getTransporter = async () => {
  if (transporter) return transporter;

  // Check if Gmail credentials are provided in .env
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    console.log('📧 Using Gmail SMTP for real email notifications');
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Google App Password
      },
    });
    return transporter;
  }

  // Fallback: Use Ethereal (fake SMTP) for dev/demo if no real credentials
  console.log('📧 No email credentials found. Using Ethereal test account.');
  const testAccount = await nodemailer.createTestAccount();
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  console.log('📧 Ethereal test account created:', testAccount.user);
  return transporter;
};

/**
 * Send an email
 * @param {string} to - recipient email
 * @param {string} subject - email subject
 * @param {string} html - HTML email body
 */
const sendEmail = async (to, subject, html) => {
  try {
    const transport = await getTransporter();
    const info = await transport.sendMail({
      from: `"Darshan Ease 🛕" <${process.env.EMAIL_USER || 'noreply@darshanease.com'}>`,
      to,
      subject,
      html,
    });

    if (!process.env.EMAIL_USER) {
      console.log(`📧 Email sent to ${to}: ${nodemailer.getTestMessageUrl(info)}`);
    } else {
      console.log(`📧 Real email sent to ${to}`);
    }
    
    return { success: true };
  } catch (err) {
    console.error('❌ Email error:', err.message);
    return { success: false };
  }
};

module.exports = sendEmail;
