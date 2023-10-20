import { Router } from "express";
import { ObjectId } from "mongodb";
import { CartsMongo } from "../DAL/DAOs/mongoDAOs/CartsMongo.js";
import { cartsModel } from "../DAL/mongoDB/models/carts.model.js";
import { ticketService } from "../services/ticket.service.js";
import { cartService } from "../services/carts.service.js";
import { productsService } from "../services/products.service.js";
import { mongoose } from "mongoose";
import { isUser } from "../middlewares/auth.middlewares.js";

const router = Router();
const cartsMongo = new CartsMongo();

router.get("/", async (req, res) => {
  try {
    const carts = await cartsMongo.findAll();
    res.status(200).json({ message: "carrito encontrado", carts });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get("/:cid", async (req, res) => {
  const { cid } = req.params;

  const cartId = new ObjectId(cid);

  try {
    const carrito = await cartsModel.findById(cartId).populate("products.id");
    res.status(200).json({ message: "Carrito encontrado", carrito });
  } catch (error) {
    res.status(500).json({ error: "Error al buscar el carrito" });
  }
});

router.post("/", async (req, res) => {
  try {
    const createCart = await cartService.createCart();
    res.status(200).json({ message: "Productos", carro: createCart });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.post("/:cid/products/:pid",isUser, async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const { quantity } = req.body;
  if (!quantity || isNaN(quantity)) {
    return res.status(400).json({ error: "Cantidad no válida" });
  }

  try {
    const updatedCart = await cartsMongo.addProductToCart(
      cartId,
      productId,
      quantity
    );
    res
      .status(200)
      .json({ message: "Producto agregado al carrito", carrito: updatedCart });
  } catch (error) {
    res.status(500).json({ error: "Error al agregar el producto al carrito" });
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
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al eliminar los productos del carrito" });
  }
});
//isadmin
router.delete("/:cid/products/:pid", async (req, res) => {
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
    res.status(200).json({ message: "Producto borrado con éxito", resultCart });
  } catch (error) {
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
    // Obtener el carrito por su ID
    const cart = await cartService.getCartById(cartId);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    // Inicializa un arreglo para llevar un registro de los productos no procesados
    const productosNoProcesados = [];

    // Recorre los productos en el carrito
    for (const productInfo of cart.products) {
      if (!mongoose.Types.ObjectId.isValid(productInfo._id)) {
        console.log(productInfo._id)
        productosNoProcesados.push(productInfo._id);
        continue;
      }

      const product = await productsService.findById(productInfo._id);
      console.log(product)

      if (!product) {
        productosNoProcesados.push(productInfo.product);
      } else if (product.stock >= productInfo.quantity) {
        // Resta el stock y actualiza el producto
        product.stock -= productInfo.quantity;
        await product.save();
      } else {
        productosNoProcesados.push(productInfo.product);
      }
    }

    // Filtra los productos no procesados en el carrito
    cart.products = cart.products.filter(
      (productInfo) => !productosNoProcesados.includes(productInfo.product)
    );

    // Actualizar el carrito para reflejar los productos no procesados
    await cartService.updateCart(cart);

    // Si hay productos no procesados, devolver sus IDs
    if (productosNoProcesados.length > 0) {
  
      return res.status(400).json({
        message: "Compra incompleta, no hay stock de los productos",
        productosNoProcesados,
      });
    }

    // Realizar la compra y guardar los detalles del ticket
    const ticketData = {
      purchase_datetime: new Date(),
      amount: cart.totalAmount,
      purchaser: "marcos", // Reemplaza esto con el nombre del comprador real
    };
    const ticket = await ticketService.createTicket(ticketData);

    res.status(201).json({ message: "Compra exitosa", ticket });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
