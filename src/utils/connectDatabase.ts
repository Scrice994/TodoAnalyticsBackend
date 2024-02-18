import mongoose from "mongoose";

export const connectDatabase = async () => {
  mongoose.set("strictQuery", false);
  //"mongodb://mongo:27017/todoAnalytics"
  await mongoose.connect("mongodb://127.0.0.1:27017/TodoList");
  console.log("Connected to todoAnalytics database");
};
