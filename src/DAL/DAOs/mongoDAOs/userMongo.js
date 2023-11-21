import  userModel  from "../../mongoDB/models/user.model.js";
import BasicMongo from "./basicMongo.js";

class UserMongo extends BasicMongo {
  constructor() {
    super(userModel);
  }

  async create(user){
    return userModel.create(user);
} 

async findUser(username) {
  return userModel.findOne({username});
}


async findById(id) {
  
  return userModel.findById(id);
}

  async findUserByRole(role) {
    const response = await userModel.findOne({ role });
    return response;
  }
}

export const userMongo = new UserMongo();