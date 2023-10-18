import { cartsModel } from "../../mongoDB/models/carts.model.js";
import { ObjectId } from "mongodb";

class CartsMongo {
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

  async createCart() {
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
    console.log("cartId:", cartId);
    console.log("productId:", productId);
    const cart = await this.getCartById(cartId);
    const existingProductIndex = cart.products.findIndex(
      (p) => p.product && p.product.equals(productId)
    );

    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity += quantity || 1;
    } else {
      cart.products.push({ product: productId, quantity: quantity || 1 });
    }
    try {
      const updatedCart = await cart.save();
      return updatedCart;
    } catch (error) {
      throw new Error("Error updating cart: " + error.message);
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

      const updatedProducts = cart.products.filter((p) => {
        return p.product && p.product.equals(pid);
      });

      cart.products = updatedProducts;

      const updatedCart = await cart.save();
      return updatedCart;
    } catch (error) {
      throw error;
    }
  }

  async updateProductQuantity(cartId, productId, updatedQuantity) {
    try {
      const cart = await cartsModel.findById(cartId).populate("products.id");

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      const productToUpdate = cart.products.find((product) =>
        product.id.equals(new ObjectId(productId))
      );
      if (!productToUpdate) {
        console.log(productToUpdate);
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
