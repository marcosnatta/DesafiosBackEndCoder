import mongoose from 'mongoose';

const collection = 'User';

const schema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
    username:String,
    role: {
        type: String,
        enum: ['user', 'premium', 'ADMIN'],
        default: 'user',
    },
    fromGithub: {
        type: Boolean,
        default: false,
    },
    cart: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Carts",
    },
    orders: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Orders",
    },
    lastConnection: {
        type: Date,
        default: Date.now,
    },
});

const userModel = mongoose.model(collection, schema);
export default userModel;
