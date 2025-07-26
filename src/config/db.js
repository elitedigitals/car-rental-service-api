import express from "express";
import mongoose from "mongoose";
import { configDotenv } from "dotenv";

configDotenv();



const connectDB =() =>{
    mongoose.connect(process.env.MONGO_URI)
    try {
        console.log("mongoDb connected ")
    } catch (error) {
       console.log("connection failed") 
    }
}


export default connectDB;