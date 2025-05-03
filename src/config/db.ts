import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      `mongodb://localhost:27017/auth-service`
    );
    // const conn = await mongoose.connect(
    //   `mongodb+srv://dwabuluka:XHkOqGJBjK5nA9QC@auth-service.5alkqzf.mongodb.net/?retryWrites=true&w=majority&appName=auth-service`
    // );
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (e: any) {
    console.log("MongoDB connection error: ", e);
    process.exit(1);
  }
};
