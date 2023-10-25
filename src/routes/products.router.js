import { Router } from "express";
import { productsMongo } from "../DAL/DAOs/mongoDAOs/ProductsMongo.js";
import { isAdmin } from "../middlewares/auth.middlewares.js";
import { ErrorMessages } from "../errors/error.enum.js";
import CustomError from "../errors/CustomError.js";
const router = Router();

router.get("/", async (req, res) => {
  try {
    const allproducts = await productsMongo.findAll(req.query);
    res.json({ allproducts });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error });
  }
});

router.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  const prodId = pid;
  try {
    const product = await productsMongo.findById(prodId);

    res.status(200).json({ message: "id del producto", product });
  } catch (error) {
    CustomError.createError(ErrorMessages.PRODUCT_NOT_FOUND);
  }
});
//is admin
router.post("/", isAdmin, async (req, res) => {
  const { title, description, price, thumbnail, code, stock, category } =
    req.body;

  if (
    !title ||
    !description ||
    !price ||
    !thumbnail ||
    !code ||
    !stock ||
    !category
  ) {
    return res.status(400).json({ message: "faltan datos del producto" });
  }

  try {
    const newProduct = await productsMongo.createProduct(req.body);
    console.log(newProduct);
    res.status(200).json({ message: "producto creado", producto: newProduct });
  } catch (error) {
    CustomError.createError(ErrorMessages.PRODUCT_NOT_CREATED);
  }
});

router.delete("/:pid", isAdmin, async (req, res) => {
  const { pid } = req.params;
  try {
    const deleteProducts = await productsMongo.deleteProduct(pid);
    res.status(200).json({ message: "producto borrado" });
  } catch (error) {
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
