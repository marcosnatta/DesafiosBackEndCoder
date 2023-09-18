import mongoose from "mongoose";


const mesaageSchema = new mongoose.Schema({
    usuario: String,
    message: String,
    },
    {
    timestamps: true, 
      });

const Mesagge = mongoose.model("Mesagge", mesaageSchema);
export {Mesagge}