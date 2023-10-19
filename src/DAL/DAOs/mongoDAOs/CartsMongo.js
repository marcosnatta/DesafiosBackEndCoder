import { cartsModel } from "../../mongoDB/models/carts.model.js";
import { ObjectId } from 'mongodb';

class CartsMongo {

  constructor() {
    
    this.productMap = new Map();
  }
  async findAll() {
    try {
      const carts = await cartsModel.find({});
      return carts;
    } catch (error) {
      return error;
    }
  }

  async getCartById(id) {
    return await cartsModel.findById(id);
  }

  async  createCart() {
    try {
      const newCart = new cartsModel();
      await newCart.save();
      return newCart;
    } catch (error) {
      throw error;
    }
  }

  async findById(id) {
    try {
      const carrito = await cartsModel.findById(id);
      if (!carrito) {
        throw new Error("Carrito no encontrado");
      }
      return carrito;
    } catch (error) {
      return error;
    }
  }


  async addProductToCart(cartId, productId, quantity) {
    try {
      if (!ObjectId.isValid(productId)) {
        
        throw new Error("ID de producto no válido");
      }

      const cart = await this.getCartById(cartId);
    
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      // Buscar el producto en el carrito
      const existingProduct = cart.products.find((p) => p.product && p.product.equals(new ObjectId(originalProductId)));

      if (existingProduct) {
        existingProduct.quantity += quantity || 1;
      } else {

        cart.products.push({ _id: productId, quantity: quantity || 1 });
  
      }

      // Calcular el totalAmount
      let totalAmount = 0;
      cart.products.forEach((product) => {
        totalAmount += product.quantity;
      });

      cart.totalAmount = totalAmount;

      const updatedCart = await cart.save();
      return updatedCart;
    } catch (error) {
      throw new Error("Error al agregar producto al carrito: " + error.message);
    }
  }
  
  
  async updateOne(id, obj) {
    try {
      const update = await cartsModel.updateOne({ _id: id }, { ...obj });
      return update;
    } catch (error) {
      return error;
    }
  }

  async removeProductFromCart(cid, pid) {
    try {
      const cart = await this.getCartById(cid);
  
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
  
      // Encuentra el índice del producto en el carrito
      const productIndex = cart.products.findIndex((product) => product._id.equals(pid));
  
      if (productIndex !== -1) {
        // Elimina el producto del carrito por su índice
        cart.products.splice(productIndex, 1);
      } else {
        throw new Error("Producto no encontrado en el carrito");
      }
  
      const updatedCart = await cart.save();
      return updatedCart;
    } catch (error) {
      throw error;
    }
  }

  async updateProductQuantity(cartId, productId, updatedQuantity) {
    try {
      const cart = await cartsModel.findById(cartId).populate("products._id");

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      const productToUpdate = cart.products.find((product) =>
        product.id.equals((productId))
      );
      if (!productToUpdate) {
        throw new Error("Producto no encontrado en el carrito");
      }

      productToUpdate.quantity = updatedQuantity;
      const updatedCart = await cart.save();
      return updatedCart;
    } catch (error) {
      throw error;
    }
  }

  async deleteCart(id) {
    try {
      const deleted = await cartsModel.findByIdAndDelete(id);
      return deleted;
    } catch (error) {
      return error;
    }
  }

  async deleteAllProducts(cartId) {
    try {
      const cart = await cartsModel.findById(cartId);

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      cart.products = [];
      await cart.save();

      return cart;
    } catch (error) {
      throw error;
    }
  }
}

export { CartsMongo };
