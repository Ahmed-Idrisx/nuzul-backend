import { z } from "zod";

export const updateUserSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(10, "First name must be less than 10 characters")
    .optional(),

  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(10, "Last name must be less than 10 characters")
    .optional(),

  phone: z
    .string()
    .trim()
    .length(11, "Phone number must be 11 digits")
    .regex(/^01[012]\d{8}$/, "Phone number must start with 010, 011, or 012")
    .optional(),
});
export const addRecentCitySchema = z.object({
  city: z
    .string()
    .trim()
    .min(2, "City must be at least 2 characters")
    .max(10, "City must be less than 10 characters"),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type AddRecentCityInput = z.infer<typeof addRecentCitySchema>;
