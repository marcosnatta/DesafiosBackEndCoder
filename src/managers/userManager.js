import { userModel } from "../persistencia/models/user.model.js"

class UserManager {

    async create(user){
        try {
            const newUser = await userModel.create(user)
            return newUser
        } catch (error) {
            return error
        }
    }

    async findUser(username){
        try {
            const user = await userModel.findOne({username})
            return user
        } catch (error) {
            return error
        }
    }
    async findUserById(id){
        try {
            const user = await userModel.findById(id)
            return user
        } catch (error) {
            return error
        }
    }
}

export const userManager = new UserManager()