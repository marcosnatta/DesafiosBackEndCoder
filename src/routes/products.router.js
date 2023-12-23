import { Router } from "express";
import { productsMongo } from "../DAL/DAOs/mongoDAOs/ProductsMongo.js";
import { isAdmin, isPremium } from "../middlewares/auth.middlewares.js";
import { ErrorMessages } from "../errors/error.enum.js";
import CustomError from "../errors/CustomError.js";
import logger from "../winston.js";
import nodemailer from 'nodemailer';
import config from "../config.js"

const router = Router();


router.get("/", async (req, res) => {
  console.log(req.session.user)
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

router.post("/",isPremium, async (req, res) => {
  const { title, description, price, thumbnail, code, stock, category } = req.body;
  if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
    logger.error("Faltan datos para crear el producto");
    return res.status(400).json({ message: "Faltan datos del producto" });
  }

  try {
    const { user } = req.session;

    const newProduct = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      category,
      owner: user && user.role === 'premium' ? user.email : 'ADMIN',
    };

    const createdProduct = await productsMongo.createProduct(newProduct);

    logger.info("Producto creado exitosamente");
    res.status(200).json({ message: "Producto creado", producto: createdProduct });
  } catch (error) {
    CustomError.createError(ErrorMessages.PRODUCT_NOT_CREATED);
    logger.error("El producto no se pudo crear");
    console.log(error);
    res.status(500).json({ error });
  }
});

router.delete("/:pid", isAdmin || isPremium, async (req, res) => {
  const { pid } = req.params;
  try {
    const userId = req.session.user._id;
    const isAdminUser = req.session.user.role === 'ADMIN';
    const product = await productsMongo.findById(pid);
    const isOwner = product.owner === userId;

    if (isAdminUser || isOwner) {
      const deleteProducts = await productsMongo.deleteProduct(pid);
      logger.info("El producto fue borrado exitosamente");

      if (req.session.user.role === 'premium') {
       sendDeletedProductEmail(product.title, transporter, res);
      } else {
        res.status(200).json({ message: 'Producto borrado' });
      }
    } else {
      logger.error("El usuario no tiene permisos para borrar este producto");
      res.status(403).json({ message: "No tienes permisos para borrar este producto" });
    }
  } catch (error) {
    console.error('Error al intentar borrar el producto:', error);
    res.status(500).json({ error: 'Error al intentar borrar el producto', details: error.message });
  }
});

async function sendDeletedProductEmail(product, res) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.gmail_user,
        pass: config.gmail_password,
      },
    });

    const mailOptions = {
      from: 'marcos.natta@gmail.com',
      to: product.owner,
      subject: 'Producto eliminado',
      text: `Hola, te informamos que tu producto  ha sido eliminado`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Correo electrónico enviado:', info.response);
    res.status(200).json({ message: 'Producto borrado y correo electrónico enviado' });
  } catch (error) {
    console.error('Error al enviar el correo electrónico:', error);
    res.status(500).json({ error: 'Error al enviar el correo electrónico' });
  }
}


router.put("/:pid", async (req, res) => {
  const { pid } = req.params;

  try {
    const userId = req.session.user._id;

    const product = await productsMongo.findById(pid);

    const isAdminUser = req.session.user.role === 'ADMIN';

    const isOwner = product.owner === userId;

    if (isAdminUser || (isOwner && req.session.user.role === 'premium')) {
      const updateProduct = await productsMongo.updateProduct(pid, req.body);
      res.status(200).json({ message: "Producto actualizado" });
    } else {
      logger.error("El usuario no tiene permisos para modificar este producto");
      res.status(403).json({ message: "No tienes permisos para modificar este producto" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});



export default router;
