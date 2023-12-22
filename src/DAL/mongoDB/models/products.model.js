import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import  userModel  from "./user.model.js";

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
    type: String, 
    default: "admin",
    validate: {
      validator: async function (value) {
        if (value === "admin") {
          return true;
        }
        if (value) {
          const user = await userModel.findOne({ email: value, role: 'premium' });
          return user !== null;
        }
        return true;
      },
      message: 'El propietario debe ser un usuario premium con el correo electrónico correspondiente',
    },
  },
});

productsSchema.pre('save', async function (next) {
  if (!this.owner) {
    try {
      const adminUser = await userModel.findOne({ username: 'admin' });
      
      if (adminUser) {
        this.owner = adminUser._id;
      } else {
        this.owner = 'admin';
      }
    } catch (error) {
      console.error("Error al buscar el usuario 'admin':", error);
    }
  }
  next();
});

productsSchema.plugin(mongoosePaginate);

export const productsModel = mongoose.model("Products", productsSchema);
