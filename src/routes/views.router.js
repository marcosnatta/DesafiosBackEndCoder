import {Router} from "express"
import {productsMongo} from "../DAL/DAOs/mongoDAOs/ProductsMongo.js"
import {cartsModel} from "../DAL/mongoDB/models/carts.model.js"


const router = Router()

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
      const cart = await cartsModel.findById(cid).populate("products.id").lean()
      res.render("cart-details", { cart });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al buscar el carrito" });
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
