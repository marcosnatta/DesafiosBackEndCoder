import { ProductsMongo } from "../DAL/DAOs/mongoDAOs/ProductsMongo.js"

class ProductsService {
  constructor() {
    this.productsMongo = new ProductsMongo();
  }

  async addProduct(product) {
    try {
      const newProduct = await this.productsMongo.addProduct(product);
      return newProduct;
    } catch (error) {
      throw new Error("Error agregar el producto");
    }
  }

  async findAll(limit =10 ,page = 1,sort,query){
    try {
        const products = await this.productsMongo.getProducts(query, sort, limit, page);
        return products;
      } catch (error) {
        throw new Error('Error al obtener los productos');
      }
  }

  async findById(id) {
    try {
      const producto = await this.productsMongo.findById(id);
     
      if (!producto) {
        throw new Error('Producto no encontrado en la base de datos');
      }
      return producto;
    } catch (error) {
      throw new Error('Error al buscar el producto: ' + error.message);
    }
  }
  

  async updateProduct(id,obj){
    try {
        const update = await this.productsMongo.updateProduct({_id:id},{...obj})
        return update
    } catch (error) {
        return error
    }
  }

  async deleteProduct(_id){
    try {
        const deleted = await this.productsMongo.findByIdAndDelete(_id)
        return deleted
    } catch (error) {
        return error
    }
  }

}
export const productsService = new ProductsService();