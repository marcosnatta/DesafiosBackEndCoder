import { productsModel } from "../../persistencia/models/products.model.js";


class ProductsMongo{


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
  const  {limit,page,sort,...query} = obj

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