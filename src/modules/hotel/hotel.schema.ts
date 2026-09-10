import { z } from "zod";

export const createHotelSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Hotel name must be at least 2 characters")
    .max(100, "Hotel name must be less than 100 characters"),

  shortDescription: z
    .string()
    .trim()
    .min(10, "Short description must be at least 10 characters")
    .max(300, "Short description must be less than 300 characters"),

  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters")
    .max(3000, "Description must be less than 3000 characters"),

  facilities: z.preprocess(
    (value) => {
      if (typeof value === "string") {
        try {
          const parsed = JSON.parse(value);

          return Array.isArray(parsed) ? parsed : value;
        } catch {
          return value;
        }
      }

      return value;
    },
    z
      .array(z.string().trim().min(1))
      .min(1, "At least one facility is required"),
  ),

  address: z
    .string()
    .trim()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address must be less than 200 characters"),

  contact: z
    .string()
    .trim()
    .min(7, "Contact must be at least 7 characters")
    .max(20, "Contact must be less than 20 characters"),

  country: z
    .string()
    .trim()
    .min(2, "Country must be at least 2 characters")
    .max(10, "Country must be less than 10 characters"),

  city: z
    .string()
    .trim()
    .min(2, "City must be at least 2 characters")
    .max(10, "City must be less than 10 characters"),
});

export type CreateHotelInput = z.infer<typeof createHotelSchema>;
