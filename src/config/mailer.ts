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
