import { z } from "zod";

export const registerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(10, "First name must be less than 10 characters"),

  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(10, "Last name must be less than 10 characters"),

  email: z.string().trim().toLowerCase().email("Please provide a valid email"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must be less than 20 characters"),

  phone: z
    .string()
    .trim()
    .length(11, "Phone number must be 11 digits")
    .regex(/^01[012]\d{8}$/, "Phone number must start with 010, 011, or 012"),
});

export const verifyOtpSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please provide a valid email"),

  otp: z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please provide a valid email"),

  password: z.string().min(1, "Password is required"),
});

export const forgetPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please provide a valid email"),
});

export const resetPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please provide a valid email"),

  otp: z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits"),

  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must be less than 20 characters"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgetPasswordInput = z.infer<typeof forgetPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
