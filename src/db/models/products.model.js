import mongoose from "mongoose"

const productsSchema = new mongoose.Schema({
        title:{
            type: String,
            require: true,
            unique: true
        },
        description:{
            type: String,
            require: true
        },
        price:{
            type: String,
            require: true
        },
        thumbnail:{
            type: String,
            require: true
        },
        code:{
            type: String,
            require: true,
            unique: true

        },
        stock:{
            type: String,
            require: true
        },
        status:{
            type: String,
            require: true
        },
        category:{
            type: String,
            require: true
        }
})

export const productsModel = mongoose.model("Products", productsSchema)