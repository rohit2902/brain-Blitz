import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USERNAME || process.env.EMAIL_USER,
    pass: process.env.SMTP_PASSWORD, 
  },
});

// Verify the connection configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Error connecting to email server:', error);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

export async function sendEmail({ to, subject, html, text }) {
    const mailOptions = {
        from: `"${process.env.SMTP_FROM_NAME || 'BrainBlitz'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USERNAME}>`,
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