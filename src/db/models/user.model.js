import mongoose from 'mongoose';

const collection = 'User';

const schema = new mongoose.Schema({
    first_name: String,
    last_name:String,
    email:String,
    age:Number,
    password:String,
    role: {
        type: String,
        default: 'usuario',
      },
      fromGithub: {
        type: Boolean,
        default:false
    },
    cart:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Carts"
    }
});

export const userModel = mongoose.model(collection, schema);