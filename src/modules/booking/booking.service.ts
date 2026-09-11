import { prisma } from "../../config/database.js";
import { sendBookingEmail } from "../../services/booking.service.js";
import {
  CheckAvailabilityInput,
  CreateBookingInput,
} from "./booking.schema.js";

async function isRoomAvailable(
  roomId: string,
  checkInDate: Date,
  checkOutDate: Date,
) {
  const room = await prisma.room.findUnique({
    where: {
      id: roomId,
    },
    select: {
      isAvailable: true,
      bookings: {
        where: {
          status: {
            not: "CANCELLED",
          },
          checkInDate: {
            lt: checkOutDate,
          },
          checkOutDate: {
            gt: checkInDate,
          },
        },
        select: {
          id: true,
        },
      },
    },
  });

  if (!room) {
    throw new Error("Room not found");
  }

  const isAvailable = room.isAvailable && room.bookings.length === 0;
  return isAvailable;
}

export async function checkRoomAvailability(input: CheckAvailabilityInput) {
  const { roomId, checkInDate, checkOutDate } = input;
  const isAvailable = await isRoomAvailable(roomId, checkInDate, checkOutDate);

  if (!isAvailable) {
    throw new Error("Room is not available for the selected dates");
  }
}

export async function bookingRoom(userId: string, input: CreateBookingInput) {
  const { roomId, checkInDate, checkOutDate, guests } = input;
  const isAvailable = await isRoomAvailable(roomId, checkInDate, checkOutDate);

  if (!isAvailable) {
    throw new Error("Room is not available for the selected dates");
  }

  const room = await prisma.room.findUnique({
    where: {
      id: roomId,
    },
    select: {
      hotelId: true,
      maxGuests: true,
      pricePerNight: true,
    },
  });

  if (!room) {
    throw new Error("Room not found");
  }

  if (guests > room.maxGuests) {
    throw new Error("Number of guests exceeds room capacity");
  }

  const timeDiff = checkOutDate.getTime() - checkInDate.getTime();

  const numberOfNights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  const totalPrice = Number(room.pricePerNight) * numberOfNights;

  const booking = await prisma.booking.create({
    data: {
      userId,
      hotelId: room.hotelId,
      roomId: roomId,
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
      guests: guests,
      totalPrice,
    },
    include: {
      user: {
        select: {
          firstName: true,
          email: true,
        },
      },
      hotel: {
        select: {
          name: true,
          address: true,
        },
      },
    },
  });

  try {
    await sendBookingEmail({
      bookingId: booking.id,
      guestName: booking.user.firstName,
      guestEmail: booking.user.email,
      hotelName: booking.hotel.name,
      hotelAddress: booking.hotel.address,
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
      totalPrice: Number(booking.totalPrice),
    });
  } catch (error) {
    console.error("Failed to send booking email:", error);
  }

  return booking;
}
