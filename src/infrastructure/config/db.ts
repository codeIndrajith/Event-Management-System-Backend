import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const connectDB = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log("PostgreSQL DB Connected");
  } catch (error: any) {
    console.error("Databse connection error: ", error);
    process.exit(1);
  }
};

export { connectDB, prisma };
