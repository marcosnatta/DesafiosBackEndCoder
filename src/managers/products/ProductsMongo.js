import { productsModel } from "../../db/models/products.model.js";


class ProductsMongo{


  async findAll(){
    try {
        const products = await productsModel.find({})
        return products
    } catch (error) {
        return error
    }
}

async createProduct(obj){
  try {
      const newProduct = await productsModel.create(obj)
      return newProduct
  } catch (error) {
      return error
  }
}

async findById(id){
  try {
      const producto = await productsModel.findById(id)
      return producto
  } catch (error) {
      return error
  }
}

async updateProduct(id,obj){
  try {
      const update = await productsModel.updateOne({_id:id},{...obj})
      return update
  } catch (error) {
      return error
  }
}

async deleteProduct(id){
  try {
      const deleted = await usersModel.findByIdAndDelete(id)
      return deleted
  } catch (error) {
      return error
  }
}

}


export const productsMongo = new ProductsMongo()