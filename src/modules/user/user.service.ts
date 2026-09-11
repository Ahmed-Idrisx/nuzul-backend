import { prisma } from "../../config/database.js";
import { imagekit } from "../../config/imagekit.js";
import { AddRecentCityInput, UpdateUserInput } from "./user.schema.js";

export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      image: true,
      role: true,
      isVerified: true,
      recentSearchedCities: true,

      hotel: true,
      bookings: true,
    },
  });

  return user;
}

export async function updateUser(
  userId: string,
  input: UpdateUserInput,
  file?: Express.Multer.File,
) {
  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      imageId: true,
    },
  });

  if (!currentUser) {
    throw new Error("User not found");
  }
  const oldImageId = currentUser.imageId;

  let image: string | undefined;
  let imageId: string | undefined;

  if (file) {
    const response = await imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
      folder: "/nuzul/users",
    });

    image = imagekit.url({
      path: response.filePath,
      transformation: [
        { quality: "auto" },
        { format: "webp" },
        { width: "512" },
      ],
    });

    imageId = response.fileId;
  }

  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      ...input,
      ...(file && {
        image,
        imageId,
      }),
    },
  });

  if (file && oldImageId) {
    await imagekit.deleteFile(oldImageId);
  }
  return user;
}

export async function addSearchedCity(
  userId: string,
  input: AddRecentCityInput,
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      recentSearchedCities: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const city = input.city.trim();

  const cities = user.recentSearchedCities.filter(
    (searchedCity) => searchedCity.toLowerCase() !== city.toLowerCase(),
  );

  cities.unshift(city);

  const updatedCities = cities.slice(0, 10); // Keep only the last 10 cities

  return prisma.user.update({
    where: { id: userId },
    data: {
      recentSearchedCities: updatedCities,
    },
    select: {
      recentSearchedCities: true,
    },
  });
}
