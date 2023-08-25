import mongoose from "mongoose";

const mesaageSchema = new mongoose.Schema({
    user: String,
    message: String,
});

export const message = mongoose.model("message", mesaageSchema);
