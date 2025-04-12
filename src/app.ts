import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/database";
dotenv.config();

const PORT = process.env.PORT || 5000;

const app: Application = express();

// Database connection
connectDB();

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
