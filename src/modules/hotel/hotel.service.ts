import { prisma } from "../../config/database.js";
import { imagekit } from "../../config/imagekit.js";
import { CreateHotelInput } from "./hotel.schema.js";

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
