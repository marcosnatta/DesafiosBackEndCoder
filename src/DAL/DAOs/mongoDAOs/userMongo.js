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
  const response = await userModel.findOne({ username });
  console.log(username)
  return response;
}


async findById(id) {
  const response = await userModel.findById(id);
  return response;
}

  async findUserByRole(role) {
    const response = await userModel.findOne({ role });
    return response;
  }
}

export const userMongo = new UserMongo();