import express, { Application } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorMiddlware";
import cors from "cors";
import { connectDB } from "./config/database";
import authRoutes from "../src/routes/auth-routes/authRoutes";
import eventRoutes from "../src/routes/Event-routes/eventRoutes";
import adminRoutes from "../src/routes/adim-routes/admin-routes";
import joinEventRoutes from "../src/routes/Event-routes/eventJoinRoutes";
dotenv.config();

const PORT = process.env.PORT ?? 5000;

const app: Application = express();

// Database connection
connectDB();

// Body Parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Enable cors
app.use(cors());

// Auth Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/join", joinEventRoutes);

// Handle errors
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
