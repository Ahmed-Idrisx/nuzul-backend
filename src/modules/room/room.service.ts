import { prisma } from "../../config/database.js";
import { imagekit } from "../../config/imagekit.js";
import { AppError } from "../../utils/app-error.js";

import { CreateRoomInput, ToggleRoomAvailabilityInput } from "./room.schema.js";

export async function roomCreator(
  userId: string,
  input: CreateRoomInput,
  files?: Express.Multer.File[],
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
    throw new AppError("User not found", 404);
  }

  if (!user.hotel) {
    throw new AppError("You don't have a hotel", 404);
  }

  const images: string[] = [];
  if (files?.length) {
    for (const file of files) {
      const response = await imagekit.upload({
        file: file.buffer,
        fileName: file.originalname,
        folder: "/nuzul/rooms",
      });

      const imageUrl = imagekit.url({
        path: response.filePath,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
          { width: "1024" },
        ],
      });

      images.push(imageUrl);
    }
  }

  await prisma.room.create({
    data: {
      ...input,
      images,
      hotelId: user.hotel.id,
    },
  });
}

export async function roomAvailabilityToggler(
  userId: string,
  input: ToggleRoomAvailabilityInput,
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
    throw new AppError("User not found", 404);
  }

  if (!user.hotel) {
    throw new AppError("You don't have a hotel", 404);
  }

  const room = await prisma.room.findFirst({
    where: {
      id: input.roomId,
      hotelId: user.hotel.id,
    },
    select: {
      id: true,
      isAvailable: true,
    },
  });

  if (!room) {
    throw new AppError("Room not found", 404);
  }

  return prisma.room.update({
    where: {
      id: room.id,
    },
    data: {
      isAvailable: !room.isAvailable,
    },
    select: {
      id: true,
      isAvailable: true,
    },
  });
}
