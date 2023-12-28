import { Router } from "express";
import { ObjectId } from "mongodb";
import { CartsMongo } from "../DAL/DAOs/mongoDAOs/CartsMongo.js";
import { ticketService } from "../services/ticket.service.js";
import { cartService } from "../services/carts.service.js";
import { productsService } from "../services/products.service.js";
import { mongoose } from "mongoose";
import { isAdmin } from "../middlewares/auth.middlewares.js";
import { ErrorMessages } from "../errors/error.enum.js";
import CustomError from "../errors/CustomError.js";
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
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    const productDetails = await Promise.all(cart.products.map(async (productInfo) => {
      const plainProduct = await productsService.findById(productInfo.product);
      console.log(productInfo.product)
      return {
        ...plainProduct,
        quantity: productInfo.quantity,
        subtotal: productInfo.quantity * plainProduct.price,
      };
    }));
    
    res.render('cart', { cart: { products: productDetails, totalAmount: cart.totalAmount } });
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.post("/", (req, res) => {
  try {
    const createCart = cartService.createCart();
    logger.info("tu carrito se creo correctamente");
    res.status(200).json({ message: "Productos", carro: createCart });
  } catch (error) {
    logger.error("no se pudo crear el carrito");
    CustomError.createError(ErrorMessages.CART_NOT_CREATED);
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const { quantity } = req.body;

  if (!quantity || isNaN(quantity)) {
    return res.status(400).json({ error: "Cantidad no válida" });
  }

  try {
    const product = await productsService.findById(productId);

    if (!product) {
      console.error("Producto no encontrado en la base de datos");
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const cart = await cartsMongo.getCartById(cartId);

    if (!cart) {
      const newCart = await cartsMongo.createCart();
      const newCartId = newCart._id;

      const updatedCart = await cartsMongo.addProductToCart(
        newCartId,
        productId,
        quantity
      );
      return res.status(200).json({
        message: "Producto agregado al carrito",
        cart: updatedCart,
      });
    }
    const updatedCart = await cartsMongo.addProductToCart(
      cartId,
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

  try {
    const borrarProds = await cartsMongo.deleteAllProducts(cartId);
    res
      .status(200)
      .json({ message: "Productos eliminados del carrito", borrarProds });
    logger.info("producto eliminado del carrito");
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
      (product) => product.id._id.toString() === pid
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

    const ticketData = {
      purchase_datetime: new Date(),
      amount: cart.totalAmount,
      purchaser: "marcos",
    };
    const ticket = await ticketService.createTicket(ticketData);

    res.status(201).json({ message: "Compra exitosa", ticket });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
