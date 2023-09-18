import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"


const cartsSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
    unique: true,
  },
  description: {
    type: String,
    require: true,
  },
  price: {
    type: String,
    require: true,
  },
  products: [{
    id:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products"
    },
    quantity: {
      type: Number,
      
    }
  }]
});

cartsSchema.plugin(mongoosePaginate)
export const cartsModel = mongoose.model("Carts", cartsSchema);