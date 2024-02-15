import mongoose from "mongoose";

export const connectDatabase = async () => {
  mongoose.set("strictQuery", false);
  await mongoose.connect("mongodb://mongo:27017/todoAnalytics");
  console.log("Connected to todoAnalytics database");
};
