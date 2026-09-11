import { OtpType } from "@prisma/client";

import { prisma } from "../../config/database.js";
import { sendOtpEmail } from "../../services/email.service.js";
import { compareOtp, generateOtp, hashOtp } from "../../utils/otp.js";
import { comparePassword, hashPassword } from "../../utils/password.js";

import {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  VerifyOtpInput,
} from "./auth.schema.js";
import { generateToken } from "../../utils/jwt-token.js";

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

  await prisma.otpVerification.deleteMany({
    where: {
      userId: user.id,
      type: OtpType.REGISTER,
    },
  });

  await prisma.otpVerification.create({
    data: {
      type: OtpType.REGISTER,
      userId: user.id,
      otpHash,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  try {
    await sendOtpEmail(user.email, otp, "REGISTER");
  } catch (error) {
    console.error("Failed to send OTP:", error);
  }
}

export async function otpVerify(input: VerifyOtpInput) {
  const { email, otp } = input;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.isVerified) {
    throw new Error("User is already verified");
  }

  const otpVerification = await prisma.otpVerification.findFirst({
    where: {
      userId: user.id,
      type: OtpType.REGISTER,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!otpVerification) {
    throw new Error("OTP not found or expired");
  }

  if (otpVerification.expiresAt < new Date()) {
    await prisma.otpVerification.delete({
      where: {
        id: otpVerification.id,
      },
    });

    throw new Error("OTP has expired");
  }

  const isOtpValid = await compareOtp(otp, otpVerification.otpHash);

  if (!isOtpValid) {
    throw new Error("Invalid OTP");
  }

  await prisma.$transaction([
    prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isVerified: true,
      },
    }),
    prisma.otpVerification.delete({
      where: {
        id: otpVerification.id,
      },
    }),
  ]);
}

export async function loginUser(input: LoginInput) {
  const { email, password } = input;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (!user.isVerified) {
    throw new Error("Please verify your email first");
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user.id);

  return {
    user,
    token,
  };
}

export async function sendResetOtp(input: ForgotPasswordInput) {
  const { email } = input;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return;
  }

  if (!user.isVerified) {
    return;
  }

  const otp = generateOtp();
  const otpHash = await hashOtp(otp);

  await prisma.otpVerification.deleteMany({
    where: {
      userId: user.id,
      type: OtpType.PASSWORD_RESET,
    },
  });

  await prisma.otpVerification.create({
    data: {
      userId: user.id,
      type: OtpType.PASSWORD_RESET,
      otpHash,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  try {
    await sendOtpEmail(user.email, otp, "PASSWORD_RESET");
  } catch (error) {
    console.error("Failed to send OTP:", error);
  }
}

export async function passwordReset(input: ResetPasswordInput) {
  const { email, otp, newPassword } = input;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid OTP or email");
  }

  const otpVerification = await prisma.otpVerification.findFirst({
    where: {
      userId: user.id,
      type: OtpType.PASSWORD_RESET,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!otpVerification) {
    throw new Error("OTP not found or expired");
  }

  if (otpVerification.expiresAt < new Date()) {
    await prisma.otpVerification.delete({
      where: {
        id: otpVerification.id,
      },
    });

    throw new Error("OTP has expired");
  }

  const isOtpValid = await compareOtp(otp, otpVerification.otpHash);

  if (!isOtpValid) {
    throw new Error("Invalid OTP");
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.$transaction([
    prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    }),

    prisma.otpVerification.delete({
      where: {
        id: otpVerification.id,
      },
    }),
  ]);
}
