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
        default: 'user',
      },
      role: {
        type: String,
        default: 'premium',
      },
      fromGithub: {
        type: Boolean,
        default:false
    },
    cart:{
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Carts"
    },
    orders:{
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Orders"
    }
});

const userModel = mongoose.model(collection, schema);
export default userModel