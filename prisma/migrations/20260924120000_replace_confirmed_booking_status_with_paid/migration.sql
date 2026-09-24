-- Rename the confirmed state to the payment state without changing existing bookings.
ALTER TYPE "public"."BookingStatus" RENAME VALUE 'CONFIRMED' TO 'PAID';
