import { Router } from "express";
import { ObjectId } from "mongodb";
import { CartsMongo } from "../DAL/DAOs/mongoDAOs/CartsMongo.js";
import { ticketService } from "../services/ticket.service.js";
import { cartService } from "../services/carts.service.js";
import { productsService } from "../services/products.service.js";
import  mongoose  from "mongoose";
import { isAdmin } from "../middlewares/auth.middlewares.js";
import logger from "../winston.js";

const router = Router();
const cartsMongo = new CartsMongo();

router.get("/", async (req, res) => {
  try {
    const carts = await cartsMongo.findAll();

    if (carts.length > 0) {
      return res.status(200).json({
        message: "Carrito encontrado",
        carts: [carts[0]],
      });
    }

    const newCart = await cartsMongo.createCart();
    return res.status(200).json({
      message: "Nuevo carrito creado",
      carts: [newCart],
    });
  } catch (error) {
    console.error("Error al obtener carritos:", error.message);
    return res.status(500).json({
      error: "Error interno del servidor",
    });
  }
});

router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartsMongo.getCartById(cid);
    const user = req.session.user;
    console.log(user)
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.status(200).json({
      message: "Carrito encontrado", cart,user
    });
    
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newCart = await cartsMongo.createCart();
    req.session.cartId = newCart._id;
    logger.info("Tu carrito se creó correctamente");
    res.status(200).json({ message: "Nuevo carrito creado", cart: newCart });
  } catch (error) {
    logger.error("No se pudo crear el carrito");
    res.status(500).json({ error: "Error interno del servidor al crear el carrito" });
  }
});


router.post("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const { quantity } = req.body;

  const userId = req.session.user;
  console.log(userId);

  if (!userId) {
    return res.status(401).json({ error: "Usuario no autenticado" });
  }

  if (!quantity || isNaN(quantity)) {
    return res.status(400).json({ error: "Cantidad no válida" });
  }

  try {
    const product = await productsService.findById(productId);
    let cart;

    if (!cartId) {
      cart = await cartsMongo.getCartByUserId(userId);
    } else {
      cart = await cartsMongo.getCartById(cartId);
    }

    if (!product) {
      console.error("Producto no encontrado en la base de datos");
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    if (!cart) {
      const newCart = await cartsMongo.createCartForUser(userId);
      req.session.cartId = newCart._id;
      cart = newCart;
    }

    const updatedCart = await cartsMongo.addProductToCart(
      cart,
      productId,
      quantity
    );

    return res.status(200).json({
      message: "Producto agregado al carrito",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Error al agregar el producto al carrito:", error.message);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});


router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;
  const cartId = new ObjectId(cid);
  console.log(cid)
  if (!ObjectId.isValid(cartId)) {
    return res.status(400).json({ error: "ID de carrito no válido" });
  }
  
  try {
    const borrarcart = await cartsMongo.deleteCart(cid);
    res
      .status(200)
      .json({ message: "carrito eliminado", borrarcart });
    logger.info("carrito eliminado");
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al eliminar los productos del carrito" });
    logger.error("no se pudo eliminar el producto");
  }
});

router.delete("/:cid/products/:pid", isAdmin, async (req, res) => {
  const { cid, pid } = req.params;
  if (!ObjectId.isValid(pid)) {
    return res.status(400).json({ error: "ID de producto no válido" });
  }
  const cartId = new ObjectId(cid);
  const productId = new ObjectId(pid);
  try {
    const resultCart = await cartsMongo.removeProductFromCart(
      cartId,
      productId
    );
    logger.info("producto borrado con exito");
    res.status(200).json({ message: "Producto borrado con éxito", resultCart });
  } catch (error) {
    logger.error("no se pudo borrar el producto");
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const cartId = new ObjectId(cid);
  const updatedData = req.body;

  try {
    const updatedCart = await cartsMongo.updateOne(cartId, updatedData);
    res.status(200).json({ message: "Carrito actualizado", updatedCart });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el carrito" });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const updatedQuantity = req.body.quantity;
  try {
    const updatedCart = await cartsMongo.updateProductQuantity(
      cid,
      pid,
      updatedQuantity
    );
    const updatedProduct = updatedCart.products.find(
      (product) => product && product.id && product.id._id && product.id._id.toString() === pid
  );
  
    res.status(200).json({
      message: "Cantidad de producto actualizada",
      cart: updatedCart,
      updatedProduct: {
        _id: updatedProduct.id._id,
        quantity: updatedProduct.quantity,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Error al actualizar la cantidad del producto en el carrito",
    });
  }
});

router.post("/:cid/purchase", async (req, res) => {
  const cartId = req.params.cid;
  
  try {
    const user = req.session.user;
    console.log(user)
    if (!req.session.user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }
    const cart = await cartService.getCartById(cartId);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const productosNoProcesados = [];

    for (const productInfo of cart.products) {
      if (!mongoose.Types.ObjectId.isValid(productInfo._id)) {
        console.log(productInfo._id);
        productosNoProcesados.push(productInfo._id);
        continue;
      }

      const product = await productsService.findById(productInfo._id);
      console.log(product);

      if (!product) {
        productosNoProcesados.push(productInfo.product);
      } else if (product.stock >= productInfo.quantity) {
        product.stock -= productInfo.quantity;
        await product.save();
      } else {
        productosNoProcesados.push(productInfo.product);
      }
    }

    cart.products = cart.products.filter(
      (productInfo) => !productosNoProcesados.includes(productInfo.product)
    );

    await cartService.updateCart(cart);

    if (productosNoProcesados.length > 0) {
      return res.status(400).json({
        message: "Compra incompleta, no hay stock de los productos",
        productosNoProcesados,
      });
    }
    const userEmail = req.session.user.email;
   
    const ticketData = {
      purchase_datetime: new Date(),
      amount: cart.totalAmount,
      purchaser: userEmail,
    };
    const ticket = await ticketService.createTicket(ticketData, userEmail);
    res.status(200).json({ "purchase": ticket });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



export default router;
