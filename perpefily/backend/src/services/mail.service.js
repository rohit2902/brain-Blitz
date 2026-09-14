import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

const smtpPort = Number(process.env.SMTP_PORT) || 465;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER || 'smtp.gmail.com',
  port: smtpPort,
  secure: smtpPort === 465, // true for 465 (SSL), false for 587 (STARTTLS)
  auth: {
    user: process.env.SMTP_USERNAME || process.env.EMAIL_USER,
    pass: process.env.SMTP_PASSWORD, 
  },
  connectionTimeout: 8000, // 8s timeout to prevent hanging connections on cloud hosts
  greetingTimeout: 8000,
  socketTimeout: 10000,
});

// Verify the connection configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Error connecting to email server:', error.message);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

export async function sendEmail({ to, subject, html, text }) {
    const smtpUser = process.env.SMTP_USERNAME || process.env.EMAIL_USER;
    const smtpPass = process.env.SMTP_PASSWORD;

    if (!smtpUser || !smtpPass) {
        const missingErr = "Missing SMTP credentials (SMTP_USERNAME / SMTP_PASSWORD) in environment variables.";
        console.error(`❌ [SMTP CONFIG ERROR] ${missingErr}`);
        throw new Error(missingErr);
    }

    const mailOptions = {
        from: `"${process.env.SMTP_FROM_NAME || 'BrainBlitz'}" <${process.env.SMTP_FROM_EMAIL || smtpUser}>`,
        to,
        subject,
        html,
        text,
    };
 
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`✉️ Email sent successfully to ${to} (ID: ${info.messageId})`);
        return info; 
    } catch (error) {
        console.error(`❌ Error sending email to ${to}:`, error.message);
        throw error; 
    }
} 

export default transporter;