import { z } from "zod";

export const checkAvailabilitySchema = z
  .object({
    roomId: z.string().min(1, "Room ID is required"),
    checkInDate: z.coerce.date(),
    checkOutDate: z.coerce.date(),
    guests: z.number().int().positive("Guests must be greater than 0"),
  })
  .refine((data) => data.checkOutDate > data.checkInDate, {
    message: "Check-out date must be after check-in date",
    path: ["checkOutDate"],
  });

export const createBookingSchema = z
  .object({
    roomId: z.string().min(1, "Room ID is required"),
    checkInDate: z.coerce.date(),
    checkOutDate: z.coerce.date(),
    guests: z.number().int().positive("Guests must be greater than 0"),
  })
  .refine((data) => data.checkOutDate > data.checkInDate, {
    message: "Check-out date must be after check-in date",
    path: ["checkOutDate"],
  });

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type CheckAvailabilityInput = z.infer<typeof checkAvailabilitySchema>;
