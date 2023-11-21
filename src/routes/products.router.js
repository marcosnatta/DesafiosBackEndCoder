import { Router } from "express";
import { productsMongo } from "../DAL/DAOs/mongoDAOs/ProductsMongo.js";
import { isAdmin, isPremium } from "../middlewares/auth.middlewares.js";
import { ErrorMessages } from "../errors/error.enum.js";
import CustomError from "../errors/CustomError.js";
import logger from "../winston.js";
const router = Router();

router.get("/", async (req, res) => {
  try {
    const allproducts = await productsMongo.findAll(req.query);
    logger.info("productos encontrados")
    res.json({ allproducts });
  } catch (error) {
    logger.error("no se encontraron productos")
    res.status(500).json({ error });
  }
});

router.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  const prodId = pid;
  try {
    const product = await productsMongo.findById(prodId);
    logger.info("producto solicitado")
    res.status(200).json({ message: "id del producto", product });
  } catch (error) {
    logger.error("no se encontro un producto con ese id")
    CustomError.createError(ErrorMessages.PRODUCT_NOT_FOUND);
  }
});

router.post("/", isAdmin, isPremium, async (req, res) => {
  console.log(req.user)
  const { title, description, price, thumbnail, code, stock, category } = req.body;
  if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
    logger.error("Faltan datos para crear el producto");
    return res.status(400).json({ message: "Faltan datos del producto" });
  }

  try {
    console.log(req.user);
    req.body.owner = req.user._id;
    const newProduct = await productsMongo.createProduct(req.body);
    logger.info("Producto creado exitosamente");
    res.status(200).json({ message: "Producto creado", producto: newProduct });
  } catch (error) {
    CustomError.createError(ErrorMessages.PRODUCT_NOT_CREATED);
    logger.error("El producto no se pudo crear");
    res.status(500).json({ message: "Error al crear el producto" });
  }
});



router.delete("/:pid",  async (req, res) => {
  const { pid } = req.params;
  try {
    const deleteProducts = await productsMongo.deleteProduct(pid);
    logger.info("el producto fue borrado exitosamente")
    res.status(200).json({ message: "producto borrado" });
  } catch (error) {
    logger.error("el producto no se pudo borrar")
    res.status(500).json({ error });
  }
});

router.put("/:pid", isAdmin, async (req, res) => {
  const { pid } = req.params;

  try {
    const updateproduct = await productsMongo.updateProduct(pid, req.body);
    res.status(200).json({ message: "producto actualizado" });
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default router;
