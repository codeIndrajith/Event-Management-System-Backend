import express, { Application, NextFunction, Request, Response } from "express";
import { connectDB } from "./infrastructure/config/db";

const app: Application = express();

// Database connection
connectDB();

app.listen(5000, () => console.log("Server running"));
