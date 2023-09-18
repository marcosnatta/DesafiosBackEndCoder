import { cartsModel } from "../../persistencia/models/carts.model.js";
import { ObjectId } from "mongodb"

class CartsMongo {
  async findAll() {
    try {
      const carts = await cartsModel.find({})
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
      const carrito  = await cartsModel.findById(_id);
      if (!carrito ) {
        throw new Error("Carrito no encontrado");
    }
      return carrito ;
    } catch (error) {
      return error;
    }
  }



  async addProductToCart(cid, pid) {
    try {
        const cart = await cartsModel.findById(cid).populate("products.id");

        if (!cart) {
            return "Carrito no encontrado";
        }

        if (!cart.products.some(product => product.id == pid)) {
            cart.products.push({ id: pid });
            const updatedCart = await cart.save();
            return updatedCart;
        } else {
            return cart;
        }
    } catch (error) {
        throw error;
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

  
  async updateProductQuantity(cartId, productId, updatedQuantity) {
    try {
        const cart = await cartsModel.findById(cartId).populate("products.id");

        if (!cart) {
            throw new Error("Carrito no encontrado");
        }
        const productToUpdate = cart.products.find(product => product.id.equals(new ObjectId(productId)));
        if (!productToUpdate) {
          console.log(productToUpdate)
            throw new Error("Producto no encontrado en el carrito");
        }

        productToUpdate.quantity = updatedQuantity;
        await cart.save();

        return cart;
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
  //tengo que devolver un array vacio para que queden eliminados mis productos
      cart.products = [];
      await cart.save();
  
      return cart;
    } catch (error) {
      throw error;
    }
  }

  
  async deleteCartProd(cid,pid){
    try {
        const cart = await cartsModel.findById(cid)
        if(!cart) throw new Error('cart not found')
        
        const response = await cartsModel.updateOne({ _id: cid }, { $pull: { products: pid } })
      return response



    } catch (error) {
      return error
    }
  }
}

export const cartsMongo = new CartsMongo();