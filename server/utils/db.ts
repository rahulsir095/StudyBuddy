import mongoose, { set } from "mongoose";
require("dotenv").config();

const dburl = process.env.DB_URL || "";


export const connectDb = async () => {
    try {
        await mongoose.connect(dburl).then(((data: any) => {
            console.log(`Database connected to ${data.connection.host}`);
        }));
    } catch (error:any) {
        console.log(error.message);
        setTimeout(connectDb, 5000);
    }
};