import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const cartsSchema = new mongoose.Schema({
  products: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
      },
      quantity: {
        type: Number,
      },
    },
  ],
  totalAmount: { type: Number, default: 0 },
});

cartsSchema.plugin(mongoosePaginate);
export const cartsModel = mongoose.model("Carts", cartsSchema);