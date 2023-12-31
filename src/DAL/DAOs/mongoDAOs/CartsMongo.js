import { cartsModel } from "../../mongoDB/models/carts.model.js";
import mongoose from "mongoose";
import { productsModel } from "../../mongoDB/models/products.model.js";
import { productsService } from "../../../services/products.service.js";

class CartsMongo {
  constructor() {
    this.productMap = new Map();
  }

  async saveCart(cart) {
    try {
      const updatedCart = await cartsModel.findOneAndUpdate(
        { _id: cart._id },
        { $set: cart },
        { new: true }
      );

      if (!updatedCart) {
        throw new Error("Carrito no encontrado");
      }

      return updatedCart;
    } catch (error) {
      throw error;
    }
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
    try {
      const cart = await cartsModel
        .findById(id)
        .populate({ path: "products._id", model: "Products" });
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      return cart;
    } catch (error) {
      throw new Error("Error al obtener el carrito: " + error.message);
    }
  }

  async getCartByUserId(userId) {
    try {
      const cart = await cartsModel.findOne({ user: userId }).populate({
        path: 'products._id',
        model: 'Products',
      });
  
      return cart;
    } catch (error) {
      console.error('Error al obtener el carrito:', error.message);
      throw error;
    }
  }

  async createCartForUser(userId) {
    try {
      const isValidUserId = mongoose.Types.ObjectId.isValid(userId);
  
      if (!isValidUserId) {
        throw new Error('ID de usuario no válido al crear el carrito');
      }
  
      let existingCart = await this.getCartByUserId(userId);
  
      if (!existingCart) {
        console.log('No se encontró un carrito existente para el usuario. Creando uno nuevo...');
        const newCart = new cartsModel({ user: userId });
        await newCart.save();
        console.log('Nuevo carrito creado para el usuario:', newCart);
  
        existingCart = newCart;
      } else {
        console.log('El usuario ya tiene un carrito existente:', existingCart);
      }
  
      return existingCart;
    } catch (error) {
      console.error('Error al crear el carrito para el usuario:', error.message);
      throw new Error('Error al crear el carrito para el usuario');
    }
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
      const carrito = await productsModel.findById(id);
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
        const cart = await this.getCartById(cartId);

        if (!cart) {
            throw new Error("Carrito no encontrado");
        }

        const existingProduct = cart.products.find(
            (p) => p._id.equals(productId)
        );

        if (existingProduct) {
            existingProduct.quantity += quantity || 1;
        } else {
            const product = await productsService.findById(productId);

            if (!product) {
                throw new Error("Producto no encontrado en la base de datos");
            }

            cart.products.push({
                _id: productId,
                quantity: quantity || 1,
                title: product.title,
                price: product.price,
                stock: product.stock,
            });
        }

        cart.totalAmount = cart.products.reduce(
            (total, product) => total + product.quantity * product.price,
            0
        );

        const updatedCart = await this.saveCart(cart);
        return updatedCart;
    } catch (error) {
        console.error("Error updating product quantity in cart:", error.message);
        throw new Error(
            "Error al actualizar la cantidad del producto en el carrito: " +
            error.message
        );
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

  async updateCart(cartId, updates) {
    const cart = await this.getCartById(cartId);

    if (updates) {
      const updatesArray = Array.isArray(updates)
        ? updates
        : Object.values(updates);

      for (const update of updatesArray) {
        const existingProduct = cart.products.find(
          (product) => product.product.toString() === update.product
        );

        if (existingProduct) {
          existingProduct.quantity += update.quantity;
        } else {
          cart.products.push(update);
        }
      }
    }

    await this.saveCart(cart);
    return cart;
  }

  async removeProductFromCart(cid, pid) {
    try {
      const cart = await this.getCartById(cid);

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      const productIndex = cart.products.findIndex((product) =>
        product._id.equals(pid)
      );

      if (productIndex !== -1) {
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
        const cart = await this.getCartById(cartId);

        if (!cart) {
            throw new Error("Carrito no encontrado");
        }

        const productToUpdate = cart.products.find((product) =>
            product._id.equals(productId)
        );

        if (!productToUpdate) {
            throw new Error("Producto no encontrado en el carrito");
        }

        productToUpdate.quantity = updatedQuantity;
        const updatedCart = await this.saveCart(cart);
        return updatedCart;
    } catch (error) {
        throw error;
    }
}


  async deleteCart(id) {
    try {
        const deleted = await cartsModel.findByIdAndDelete(id);
        console.log('Cart deleted:', deleted);
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
