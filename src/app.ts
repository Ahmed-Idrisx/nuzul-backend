import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { env } from "./config/env.js";

// routes
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import hotelRoutes from "./modules/hotel/hotel.routes.js";

const app = express();

// CORS configuration
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);
// middlewares
app.use(express.json()); // body parsing middleware
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse Cookie header and populate req.cookies

// auth
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// hotel
app.use("/api/hotels", hotelRoutes);

export default app;
