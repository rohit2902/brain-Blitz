import dotenv from "dotenv";
dotenv.config();
import { sendEmail } from "./src/services/mail.service.js";
import verifyEmailTemplate from "./src/services/email/verify-email.template.js";

async function testSmtp() {
  console.log("Starting SMTP Test...");
  try {
    const fakeUser = {
      username: "Sumit Test",
      email: "khushwaharohit03@gmail.com" // sending to yourself for testing
    };
    const fakeToken = "test_verify_token_123456";
    
    const htmlTemplate = verifyEmailTemplate(fakeUser, fakeToken);

    console.log("Sending email to:", fakeUser.email);
    
    const info = await sendEmail({
      to: fakeUser.email,
      subject: "🔧 BrainBlitz SMTP Test",
      html: htmlTemplate,
    });

    console.log("✅ SMTP Test Successful!");
    console.log("Message ID:", info.messageId);
  } catch (error) {
    console.error("❌ SMTP Test Failed!");
    console.error(error);
  }
}

testSmtp();