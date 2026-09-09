import { OtpType } from "@prisma/client";

import { generateOtp, hashOtp } from "../../utils/otp.js";
import { hashPassword } from "../../utils/password.js";
import { RegisterInput } from "./auth.schema.js";
import { prisma } from "../../config/database.js";

export async function registerUser(input: RegisterInput) {
  const { firstName, lastName, email, password, phone } = input;

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("Email is already registered");
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
    },
  });

  const otp = generateOtp();
  const otpHash = await hashOtp(otp);

  await prisma.otpVerification.create({
    data: {
      type: OtpType.REGISTER,
      userId: user.id,
      otpHash,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  return {
    user,
    otp,
  };
}
