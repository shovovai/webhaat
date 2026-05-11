import mongoose from "mongoose";
export * from "./models/core";
export const connectDatabase = async (uri: string): Promise<typeof mongoose> => {
  mongoose.set("strictQuery", true);
  return mongoose.connect(uri, { autoIndex: process.env.NODE_ENV !== "production" });
};
