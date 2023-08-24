import { cartsModel } from "../../db/models/carts.model.js";

class CartsMongo {
  async findAll() {
    try {
      const carts = await cartsModel.find({});
      return carts;
    } catch (error) {
      return error;
    }
  }

  async createCart(obj) {
    try {
      const cart = await cartsModel.create(obj);
      let id
      if (!carritos.length) {
        id = 1;
      } else {
        id = carritos[carritos.length - 1].id + 1;
      }
      return cart;
    } catch (error) {
      return error;
    }
  }

  async findById(_id) {
    try {
      const cart = await cartsModel.findById(_id);
      return cart;
    } catch (error) {
      return error;
    }
  }

  async addProductToCart(cid, pid) {
    try {
      const cart = await cartsModel.findById(cid);
      if (!cart) {
        return "carrito no encontrado";
      }
      if (!cart.products.includes(pid)) {
        cart.products.push(pid);
        const updatedCart = await cart.save();
        return updatedCart;
      } else {
        return cart;
      }
    } catch (error) {
      throw error;
    }
  }



  async updateCart(id, obj) {
    try {
      const update = await cartsModel.updateOne({ _id: id }, { ...obj });
      return update;
    } catch (error) {
      return error;
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
}

export const cartsMongo = new CartsMongo();
