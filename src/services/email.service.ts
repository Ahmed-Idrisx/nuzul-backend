import { env } from "../config/env.js";
import { transporter } from "../config/nodemailer.js";

export async function sendOtpEmail(
  email: string,
  otp: string,
  type: "REGISTER" | "PASSWORD_RESET",
) {
  const subject =
    type === "REGISTER"
      ? "Verify your Nuzul account"
      : "Reset your Nuzul password";

  const title =
    type === "REGISTER" ? "Verify your account" : "Reset your password";

  await transporter.sendMail({
    from: `"Nuzul" <${env.SMTP_FROM}>`,
    to: email,
    subject,
    html: `
        <h2>${title}</h2>

        <p>Your verification code is:</p>

        <h1 style="letter-spacing: 8px;">
          ${otp}
        </h1>

        <p>This code is valid for 10 minutes only.</p>

        <p>If you didn't request this code, you can ignore this message.</p>
    `,
  });
}
