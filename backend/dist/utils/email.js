"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
async function sendEmail({ to, subject, text }) {
    try {
        const host = process.env.SMTP_HOST || '';
        const port = Number(process.env.SMTP_PORT) || 587;
        const user = process.env.SMTP_USER || '';
        const pass = process.env.SMTP_PASS || '';
        if (!host || !user || !pass) {
            console.log('--- EMAIL SIMULATION (SMTP not configured in ENV) ---');
            console.log(`To: ${to}`);
            console.log(`Subject: ${subject}`);
            console.log(`Body:\n${text}`);
            console.log('----------------------------------------------------');
            return true;
        }
        const transporter = nodemailer_1.default.createTransport({
            host,
            port,
            secure: port === 465,
            auth: { user, pass }
        });
        await transporter.sendMail({
            from: `"Odoo Cafe" <${user}>`,
            to,
            subject,
            text
        });
        console.log(`[Email Campaign] Email successfully sent to ${to}`);
        return true;
    }
    catch (error) {
        console.error(`[Email Campaign] Failed to send email to ${to}:`, error);
        return false;
    }
}
