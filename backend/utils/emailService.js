const nodemailer = require('nodemailer');

let transporter = null;

const initTransporter = async () => {
  if (transporter) return transporter;

  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_PORT == 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    console.log("📧 Real SMTP Transporter initialized");
  } else {
    // Generate test account for Ethereal
    let testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log("📧 Test Ethereal SMTP Transporter initialized");
  }
  return transporter;
};

const sendEmail = async (to, subject, html) => {
  try {
    const tp = await initTransporter();
    
    // Wrap email in a branded template
    const brandedHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="background: linear-gradient(135deg, #1e1e2f 0%, #2d2d44 100%); padding: 24px; text-align: center; border-bottom: 4px solid #00d4ff;">
          <div style="display: inline-block; background: #00d4ff; color: #1e1e2f; width: 40px; height: 40px; line-height: 40px; border-radius: 8px; font-weight: bold; font-size: 24px; margin-bottom: 10px; box-shadow: 0 0 15px rgba(0,212,255,0.5);">Q</div>
          <h2 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 600;">Quick <span style="color: #00d4ff;">Space</span></h2>
        </div>
        <div style="padding: 30px; background-color: #ffffff; color: #374151; line-height: 1.6; font-size: 16px;">
          ${html}
        </div>
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 13px; color: #6b7280; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} Quick Space. All rights reserved.</p>
          <p style="margin: 8px 0 0 0;">This is an automated message, please do not reply.</p>
        </div>
      </div>
    `;

    let info = await tp.sendMail({
      from: `"Quick Space" <${process.env.SMTP_USER || 't06546666@gmail.com'}>`,
      to: to,
      subject: subject,
      html: brandedHtml,
    });

    console.log("✅ Message sent: %s", info.messageId);
    
    // For Ethereal, print the link to view the email in terminal
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log("🔍 Preview URL: %s", previewUrl);
    }
    
    return true;
  } catch (error) {
    console.error("❌ Error sending email: ", error);
    return false;
  }
};

module.exports = {
  sendEmail
};
