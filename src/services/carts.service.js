import {CartsMongo} from "../DAL/DAOs/mongoDAOs/CartsMongo.js"
import { productsService } from "./products.service.js";

class CartService {
  constructor() {
    this.cartsMongo = new CartsMongo();
  }

  async createCart() {
    try {
      const newCart = await this.cartsMongo.createCart();
      return { message: "Carrito creado", cart: newCart };
    } catch (error) {
      throw error; // Lanza el error original en lugar de crear uno nuevo
    }
  }
  

  async getCartById(id) {
    try {
      const cart = await this.cartsMongo.getCartById(id);
      return cart;
    } catch (error) {
      throw new Error("Error al obtener el carrito");
    }
  }

  async addProductToCart(cid, pid, quantity) {
    try {
      const cart = await this.cartsMongo.addProductToCart(cid, pid, quantity);
      return this.calculateTotalAmount(cart);
    } catch (error) {
      throw new Error("Error al agregar el producto al carrito");
    }
  }

  async removeProductFromCart(cid, pid) {
    try {
      const cart = await this.cartsMongo.removeProductFromCart(cid, pid);
      return { message: "Producto eliminado del carrito", cart };
    } catch (error) {
      throw new Error("Error al eliminar el producto del carrito");
    }
  }

  async updateCart(cartId, obj) {
    try {
      const cart = await this.cartsMongo.updateCart(cartId, obj);
      return { message: "Carrito actualizado", cart };
    } catch (error) {
      throw new Error("Error al actualizar el carrito");
    }
  }

  async updateProductQuantity(cartId, productId, newQuantity) {
    try {
      const cart = await this.cartsMongo.updateProductQuantity(cartId, productId, newQuantity);
      return { message: "Cantidad actualizada", cart };
    } catch (error) {
      throw new Error("Error al actualizar la cantidad del producto en el carrito");
    }
  }

  async clearCart(cartId) {
    try {
      const cart = await this.cartsMongo.clearCart(cartId);
      return { message: "Se han eliminado todos los productos del carrito", cart };
    } catch (error) {
      throw new Error("Error al vaciar el carrito");
    }
  }

  async calculateTotalAmount(cart) {
    try {
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
  
      let totalAmount = 0;
  
      for (const productInfo of cart.products) {
        const product = await productService.getProductById(productInfo.product);
        if (product) {
          totalAmount += product.price * productInfo.quantity;
        }
      }
  
      cart.totalAmount = totalAmount;
      await this.cartsMongo.saveCart(cart);
  
      return cart;
    } catch (error) {
      throw new Error("Error al calcular el total: " + error.message);
    }
  }
  

}

export const cartService = new CartService();
