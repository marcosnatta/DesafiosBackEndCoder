import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

const productsSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
      },
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
            type: Number,
            require: true
        },
        thumbnail:{
            type: String,
        },
        code:{
            type: String,
            require: true,
            unique: true

        },
        stock:{
            type: Number,
        },
        status:{
            type: String,
        },
        category:{
            type: String,
            
        }
})

productsSchema.plugin(mongoosePaginate)

export const productsModel = mongoose.model("Products", productsSchema)