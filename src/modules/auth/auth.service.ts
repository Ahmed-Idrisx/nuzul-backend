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
import { AppError } from "../../utils/app-error.js";

export async function registerUser(input: RegisterInput) {
  const { firstName, lastName, email, password, phone } = input;

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new AppError("Email is already registered", 400);
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
    throw new AppError("User not found", 404);
  }

  if (user.isVerified) {
    throw new AppError("User is already verified", 400);
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
    throw new AppError("OTP not found or expired", 400);
  }

  if (otpVerification.expiresAt < new Date()) {
    await prisma.otpVerification.delete({
      where: {
        id: otpVerification.id,
      },
    });

    throw new AppError("OTP has expired", 400);
  }

  const isOtpValid = await compareOtp(otp, otpVerification.otpHash);

  if (!isOtpValid) {
    throw new AppError("Invalid OTP", 400);
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
    throw new AppError("Invalid email or password", 400);
  }

  if (!user.isVerified) {
    throw new AppError("Please verify your email first", 400);
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 400);
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
    throw new AppError("Invalid OTP or email", 400);
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
    throw new AppError("OTP not found or expired", 400);
  }

  if (otpVerification.expiresAt < new Date()) {
    await prisma.otpVerification.delete({
      where: {
        id: otpVerification.id,
      },
    });

    throw new AppError("OTP has expired", 400);
  }

  const isOtpValid = await compareOtp(otp, otpVerification.otpHash);

  if (!isOtpValid) {
    throw new AppError("Invalid OTP", 400);
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
