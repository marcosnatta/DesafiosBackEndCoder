import mongoose from "mongoose";



//mongoose
const URI = "mongodb+srv://marcosnatta:marcosnatta1234@cluster0.cibfyui.mongodb.net/ecommerce?retryWrites=true&w=majority"
mongoose.connect(URI)
.then(()=> console.log("conectado a la base de datos"))
.catch(error=>console.log(error))
