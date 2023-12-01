import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  thumbnail: {
    type: String,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  stock: {
    type: Number,
  },
  status: {
    type: String,
  },
  category: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', 
  },
});

productsSchema.plugin(mongoosePaginate);

export const productsModel = mongoose.model("Products", productsSchema);
