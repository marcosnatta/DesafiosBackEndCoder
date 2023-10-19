import { productsModel } from "../../mongoDB/models/products.model.js";
import {mongoose} from "mongoose"
export class ProductsMongo{


/*
  async findAll(){
    try {
        const products = await productsModel.find({})
        return products
    } catch (error) {
        return error
    }
}
*/
async findAll(obj){
  const  {limit =10 ,page = 1,sort,...query} = obj

  try{
 
    //const resultProd = await productsModel.paginate({title:"producto4"},{limit,page,sort:{price:sortPrice}})
    const resultProd = await productsModel.paginate(query,{limit,page,sort})
    const products = await productsModel.find({})
    const infoProds = {
        count: resultProd.totalDocs,
        status:resultProd.status,
        payload: resultProd.docs,
        totalPages: resultProd.totalPages,
        prevPage: resultProd.prevPage,
        nextPage: resultProd.nextPage,
        hasPrevPage:resultProd.hasPrevPage,
        hasNextPage:resultProd.hasNextPage,
        nextLink: resultProd.hasNextPage
          ? `http://localhost:8080/api/products?page=${resultProd.nextPage}`
          : null,
        prevLink: resultProd.hasPrevPage
          ? `http://localhost:8080/api/products?page=${resultProd.prevPage}`
          : null,
      }
      return {infoProds, products}

  }catch (error){
    return error
  }
}

async addProduct(product) {
  const newProduct = new productsModel(product);
  await newProduct.save();
  return newProduct;
}

async createProduct(obj){
  try {
      const newProduct = await productsModel.create(obj)
      return newProduct
  } catch (error) {
      return error
  }
}

async findById(id) {
  return await productsModel.findById(id)
}



async updateProduct(id,obj){
  try {
      const update = await productsModel.updateOne({_id:id},{...obj})
      return update
  } catch (error) {
      return error
  }
}

async deleteProduct(id) {
  try {
    const deleted = await productsModel.findByIdAndDelete(id);
    return deleted;
  } catch (error) {
    return error;
  }
}


}


export const productsMongo = new ProductsMongo()