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
    type === "REGISTER" ? "تأكيد البريد الإلكتروني" : "إعادة تعيين كلمة المرور";

  await transporter.sendMail({
    from: `"Nuzul" <${env.SMTP_FROM}>`,
    to: email,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; direction: rtl;">
        <h2>${title}</h2>

        <p>رمز التحقق الخاص بك هو:</p>

        <h1 style="letter-spacing: 8px;">
          ${otp}
        </h1>

        <p>هذا الرمز صالح لمدة 10 دقائق فقط.</p>

        <p>إذا لم تطلب هذا الرمز، يمكنك تجاهل هذه الرسالة.</p>
      </div>
    `,
  });
}
