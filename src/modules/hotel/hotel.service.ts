import { prisma } from "../../config/database.js";
import { imagekit } from "../../config/imagekit.js";
import { CreateHotelInput } from "./hotel.schema.js";

// Creates a new hotel for the authenticated user
export async function createHotel(
  userId: string,
  input: CreateHotelInput,
  file?: Express.Multer.File,
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      hotel: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.hotel) {
    throw new Error("You already have a hotel");
  }

  let image: string | undefined;
  let imageId: string | undefined;

  if (file) {
    const response = await imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
      folder: "/nuzul/hotels",
    });

    image = imagekit.url({
      path: response.filePath,
      transformation: [
        { quality: "auto" },
        { format: "webp" },
        { width: "1024" },
      ],
    });

    imageId = response.fileId;
  }

  await prisma.$transaction([
    prisma.hotel.create({
      data: {
        ...input,
        ownerId: userId,
        ...(file && {
          image,
          imageId,
        }),
      },
    }),

    prisma.user.update({
      where: { id: userId },
      data: {
        role: "HOTEL_OWNER",
      },
    }),
  ]);
}

// get all hotels
export async function listHotels() {
  const hotels = await prisma.hotel.findMany({
    select: {
      id: true,
      name: true,
      image: true,
      country: true,
      city: true,
      shortDescription: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return hotels;
}

// get hotel by id
export async function getHotelById(hotelId: string) {
  const hotel = await prisma.hotel.findUnique({
    where: {
      id: hotelId,
    },
    select: {
      id: true,
      name: true,
      image: true,
      country: true,
      city: true,
      address: true,
      contact: true,
      shortDescription: true,
      description: true,
      facilities: true,

      rooms: {
        where: {
          isAvailable: true,
        },
        select: {
          id: true,
          roomType: true,
          shortDescription: true,
          description: true,
          amenities: true,
          pricePerNight: true,
          maxGuests: true,
          images: true,
          isAvailable: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!hotel) {
    throw new Error("Hotel not found");
  }

  return hotel;
}
