import nodemailer from "nodemailer";
import fs from "fs-extra";
import path from "path";
import handlebars from "handlebars";
import dotenv from "dotenv";

dotenv.config();
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Missing email credentials in environment variables.");
  }

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    pool: true,
    maxConnections: 10,
    maxMessages: 200,
    tls: { rejectUnauthorized: true },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  if (process.env.NODE_ENV === "development") {
    transporter.verify((error) => {
      if (error) {
        console.error("Transporter verification failed:", error);
      } else {
        console.log("Email transporter is ready.");
      }
    });
  }

  return transporter;
};

const emailTransporter = createTransporter();

const sendTemplatedMail = async (toEmail, subject, templateName, data) => {
  try {
    const templatePath = path.resolve(
      "src",
      "Templates",
      "email",
      `${templateName}.hbs`
    );

    const templateSource = await fs.readFile(templatePath, "utf8");
    const compiledTemplate = handlebars.compile(templateSource);
    const html = compiledTemplate(data);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject,
      html,
      priority: "high",
    };

    return await emailTransporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Email sending failed:", error.message);
    throw new Error("Failed to send email. Please try again later.");
  }
};

export default sendTemplatedMail;
