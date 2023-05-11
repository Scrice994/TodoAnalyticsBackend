import mongoose from "mongoose";

export const databaseConnection = async () => {
  mongoose.set('strictQuery', false)
  await mongoose.connect("mongodb://localhost:27017/todoAnalytics");
};

export const clearDatabase = async () => {
  await mongoose.connection.dropDatabase()
}

export const initializeData = async (array: any[], model: mongoose.Model<any>) => {
  await model.insertMany(array);
};


export const closeDatabaseConnection = async () => {
  await mongoose.connection.close();
}
