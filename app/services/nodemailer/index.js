import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
import buildEmailTemplate from "./buildEmailTemplate.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export const sendEmail = async (to, type, data = {}) => {
  const { subject, html } = buildEmailTemplate(type, data);

  const mailOptions = {
    from: `"Smart Finder" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email (${type}) sent to:`, to);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};
