import mongoose from "mongoose";

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
  quantity:{
    type: String,
    require:true
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  }]
});

export const cartsModel = mongoose.model("Carts", cartsSchema);
