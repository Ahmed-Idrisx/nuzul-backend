import { prisma } from "../../config/database.js";
import { imagekit } from "../../config/imagekit.js";

import { CreateRoomInput } from "./room.schema.js";

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
    throw new Error("User not found");
  }

  if (!user.hotel) {
    throw new Error("You don't have a hotel");
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
