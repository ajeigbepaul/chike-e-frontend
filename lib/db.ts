import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

export async function connectToDatabase() {
  // Check if the connection is already established
  const connectionState = mongoose.connection.readyState;
  if (connectionState === 1) {
    // Already connected
    console.log("Already connected to MongoDB with Mongoose");
    return;
  }
  if (connectionState === 2) {
    // Connecting
    console.log("MongoDB connection is in progress");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "chikebackend",
      bufferCommands: true,
    } as any);

    console.log("Connected to MongoDB with Mongoose");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}
