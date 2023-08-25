import mongoose from "mongoose";

const mesaageSchema = new mongoose.Schema({
    user: String,
    message: String,
});

const Mesagge = mongoose.model("Mesagge", mesaageSchema);
export {Mesagge}