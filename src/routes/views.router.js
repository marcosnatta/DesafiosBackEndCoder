import {Router} from "express"
import {productsMongo} from "../DAL/DAOs/mongoDAOs/ProductsMongo.js"
import { CartsMongo } from "../DAL/DAOs/mongoDAOs/CartsMongo.js"
import { cartService } from "../services/carts.service.js"
import mongoose from "mongoose"
import { productsService } from "../services/products.service.js"
import { ticketService } from "../services/ticket.service.js"

const router = Router()
const cartsMongo = new CartsMongo();

router.get("/chat", (req,res)=>{
    res.render("chat")
})

router.get("/products", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const sort = req.query.sort || 'asc';
    try {
      const result = await productsMongo.findAll({ page, limit });
      const productsForPage = result.infoProds.payload.map(product => ({
        _id: product._id,
        title: product.title,
        description: product.description,
        price: product.price,
        thumbnail: product.thumbnail,
        code: product.code,
        stock: product.stock,
        status: product.status,
        category: product.category
      }));
      const totalPages = result.infoProds.totalPages;
  
      const pageRange = Array.from({ length: totalPages }, (_, i) => i + 1);
      const user = req.session.user;

      res.render("products", { products: productsForPage, totalPages, pageRange, user });
    } catch (error) {
      res.status(500).json({ error });
      console.log(error);
    }
  });

router.get("/products/:pid", async (req, res) => {
  const productId = req.params.pid;

  try {
      const product = await productsMongo.findById(productId);

      if (product && typeof product.toObject === "function") {
          const productBasic = product.toObject();
          res.render("product-details", { product: productBasic });
      } else {
          res.status(404).json({ error: "Producto no encontrado" });
      }
  } catch (error) {
      res.status(500).json({ error });
      console.log(error);
  }
});

router.get("/carts/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartsMongo.getCartById(cid);
    
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    const user = req.session.user;
     res.render("cart-detail" ,{ cart,user });
    //  res.status(200).json({cart})
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.get("/carts/:cid/purchase", async (req, res) => {
  const cartId = req.params.cid;
  if (!req.session.user) {
    return res.status(401).json({ error: "Usuario no autenticado" });
  }


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
      purchaser: req.session.user.email,
    };
    const userEmail = req.session.user.email;
    const ticket = await ticketService.createTicket(ticketData, userEmail);
    // res.status(200).json({ "purchase": ticket });
    res.render("purchase", { ticket });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});





// desafio de login y registro

const privateAcces = (req,res,next)=>{
  if(!req.session.user) return res.redirect('/login');
  next();
}

const publicAcces = (req,res,next) =>{
  if(req.session.user) return res.redirect('/profile');
  next();
}  

//mails

router.get('/register', publicAcces, (req,res)=>{
  res.render('register')
})

router.get('/login', publicAcces, (req,res)=>{
  res.render('login')
})

router.get('/profile', privateAcces ,(req,res)=>{
  res.render('profile',{
      user: req.session.user
    })
    
})


export default router
