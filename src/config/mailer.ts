import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { SMTP_HOST, SMTP_PASS, SMTP_PORT, SMTP_USER } from "./env";

export const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: false,
  tls: { rejectUnauthorized: false },
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
} as SMTPTransport.Options);

export const transporter1 = nodemailer.createTransport({
  host: "weblotts.com", // e.g., 'smtp.example.com'
  port: 587, // or 465 for SSL
  secure: false, // true for 465, false for other ports
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    user: "noreply@weblotts.com",
    pass: "12345",
  },
});
