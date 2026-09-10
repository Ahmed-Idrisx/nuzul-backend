import { z } from "zod";

export const createRoomSchema = z.object({
  roomType: z
    .string()
    .trim()
    .min(2, "Room type must be at least 2 characters")
    .max(100, "Room type must be less than 100 characters"),

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

  amenities: z.preprocess(
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
      .min(1, "At least one amenity is required"),
  ),

  pricePerNight: z.coerce.number().positive("Price must be greater than 0"),

  maxGuests: z.coerce
    .number()
    .int("Maximum guests must be a whole number")
    .min(1, "Maximum guests must be at least 1"),
});

export const toggleRoomAvailabilitySchema = z.object({
  roomId: z.string().min(1, "Room ID is required"),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type ToggleRoomAvailabilityInput = z.infer<
  typeof toggleRoomAvailabilitySchema
>;
