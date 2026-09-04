import nodemailer from 'nodemailer';

export const handler = async (event) => {
    console.log("Received event:", event);

    const { to, subject, html } = event;

    if (!to || !subject || !html) {
        return { success: false, error: "Missing required fields" };
    }

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            }
        });

        const info = await transporter.sendMail({
            from: `"Quick Space" <${process.env.SMTP_USER}>`,
            to: to,
            subject: subject,
            html: html,
        });

        console.log("Email sent successfully:", info.messageId);
        
        return {
            success: true,
            messageId: info.messageId
        };
    } catch (error) {
        console.error("Failed to send email:", error);
        return {
            success: false,
            error: error.message
        };
    }
};
