import { cartService } from "../services/carts.service.js";
import { CartsMongo } from "../DAL/DAOs/mongoDAOs/CartsMongo.js";

class CartController {
  constructor() {
    this.cartsMongo = new CartsMongo();
  }

  async createCart(req, res) {
    try {
      const newCart = await cartService.createCart();
      res.status(201).json({ cart: newCart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCartById(req, res) {
    const { cid } = req.params;

    try {
      const cart = await this.cartsMongo.getCartById(cid);

      if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }
    
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async getProductDetails(productInfos) {
    try {
      return await Promise.all(
        productInfos.map(async (productInfo) => {
          const isValidObjectId = mongoose.Types.ObjectId.isValid(productInfo._id);
          if (!isValidObjectId) {
            console.error("ID de producto no válido:", productInfo._id);
            throw new Error("ID de producto no válido");
          }
          const plainProduct = await productsService.findById(productInfo._id);
          return {
            ...plainProduct,
            quantity: productInfo.quantity,
            subtotal: productInfo.quantity * plainProduct.price,
          };
        })
      );
    } catch (error) {
      console.error("Error al obtener detalles del producto:", error);
      throw error;
    }
  }

  async addProductToCart(req, res) {
    const { cartId } = req.params;
    const { productId, quantity } = req.body;
  
    try {
      const cart = await cartService.addProductToCart(cartId, productId, quantity);
      res.redirect(`/carts/${cartId}`);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async removeProductFromCart(req, res) {
    const { cartId } = req.params;
    const { productId } = req.body;

    try {
      const cart = await cartService.removeProductFromCart(cartId, productId);
      const updatedCart = await cartService.calculateTotalAmount(cart);

    res.status(200).json({ cart: updatedCart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateCart(req, res) {
    const { cartId } = req.params;
    const { updates } = req.body;
    try {
      const cart = await cartService.updateCart(cartId, updates);
  
      res.status(200).json({ cart });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async updateProductQuantity(req, res) {
    const { cartId, productId } = req.params;
    const { newQuantity } = req.body;

    try {
      const cart = await cartService.updateProductQuantity(cartId, productId, newQuantity);
      res.status(200).json({ cart });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async clearCart(req, res) {
    const { cartId } = req.params;

    try {
      const cart = await cartService.clearCart(cartId);
      const updatedCart = await cartService.calculateTotalAmount(cart);

      res.status(200).json({ cart: updatedCart });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}

export const cartController = new CartController();

