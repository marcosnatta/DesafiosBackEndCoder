import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()


//mongoose
const URI = process.env.MONGO_URL;
mongoose.connect(URI)
.then(()=> console.log("conectado a la base de datos"))
.catch(error=>console.log(error))
