import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const cartsSchema = new mongoose.Schema({
  totalAmount: Number,
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Products',
    },
    quantity: Number,
  }],
});

cartsSchema.virtual('products.id', {
  ref: 'Products',
  localField: 'products.product',
  foreignField: '_id',
  justOne: true,
});

cartsSchema.plugin(mongoosePaginate);

export const cartsModel = mongoose.model("Carts", cartsSchema);
