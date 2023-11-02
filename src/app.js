import express from "express"
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"
import {__dirname} from "./utils.js"
import handlebars from "express-handlebars"
import viewsRouter from "./routes/views.router.js"
import {Server} from "socket.io"
import {productsMongo} from "./DAL/DAOs/mongoDAOs/ProductsMongo.js"
import {Mesagge} from "./DAL/mongoDB/models/messages.model.js"
import cookieParser from "cookie-parser"
import session from "express-session"
import MongoStore from "connect-mongo"
import sessionRouter from "./routes/sessions.router.js"
import "./DAL/mongoDB/dbConfig.js"
import passport from "passport"
import './passport/passportStrategies.js'
import config from "./config.js"
import { isUser } from "./middlewares/auth.middlewares.js"
import { generateProduct } from "./mocks/mocks.js"
import { ErrorMessages } from "./errors/error.enum.js"
import { errorMiddleware } from "./errors/error.middleware.js"
import CustomError from "./errors/CustomError.js"
import { logger } from "./winston.js"


const app = express()

// cookie
app.use(cookieParser())
app.use(session({
  store: new  MongoStore({
    mongoUrl: config.mongoUrl,
    mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
    ttl:15

  }),
  secret: process.env.SESSION_SECRET,
  resave:false,
  saveUninitialized: false,
  cookie: {maxAge:60000}
}))
//express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname +"/public"))

//passport
app.use(passport.initialize())
app.use(passport.session())

//parte de handlebars
app.engine("handlebars", handlebars.engine())
app.set("views", __dirname +"/views")
app.set("view engine","handlebars")

// mis routers
//app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("/", viewsRouter)
app.use("/api/products", productsRouter)

//session
app.use("/session",sessionRouter)




// chat
app.get("/chat", (req, res) => {
  res.render("chat", { messages: [] }); 
});

//login register y profile
app.get('/login', (req, res) => {
  res.render('login'); 
});

app.get('/register', (req, res) => {
  res.render('register'); 
});

app.get('/profile', (req, res) => {
  res.render('profile', {
    user: req.session.user,
  }); 
});

// mock
app.get("/mockingproducts", (req, res) => {
  const products = [];
  for (let i = 0; i < 100; i++) {
    const productsMock = generateProduct();
    products.push(productsMock);
  }
  res.json(products);
});


// test
app.get("/products", (req, res) => {
  CustomError.createError(ErrorMessages.PRODUCT_NOT_FOUND);
  // NotFoundDocumentError.createError("producto");
});

app.use(errorMiddleware)

const PORT = config.port
const httpServer = app.listen(PORT, ()=>{
  logger.info(`escuchando el puerto ${PORT}`)
  //console.log(`escuchando el puerto ${PORT}`)
})

//agregar un producto nuevo
const socketServer = new Server(httpServer)
socketServer.on("connection", (socket) => {
    console.log("Cliente conectado:", socket.id);

    socket.on("createProduct", async (nuevoproduct) => {
      try {
        const agregarProducto = await productsMongo.createProduct(
          nuevoproduct.title,
          nuevoproduct.description,
          nuevoproduct.price,
          nuevoproduct.thumbnail,
          nuevoproduct.code,
          nuevoproduct.stock,
          nuevoproduct.status,
          nuevoproduct.category
        );
  
        if (typeof agregarProducto === "string") {
          socket.emit("addProductError", agregarProducto);
        } else {
          socketServer.emit("addProductSuccess", agregarProducto);
        }
      } catch (error) {
        socket.emit("addProductError", "Error al agregar el producto.");
      }
    });

    //eliminar producto
    
    socket.on("deleteProduct", async (ProdId) => {
      try {
        const result = await productsMongo.deleteProduct(ProdId);
        if (result === "producto con id no encontrado") {
          socket.emit("deleteProductError", result);
        } else {
          socketServer.emit("deleteProductSuccess", ProdId);
        }
      } catch (error) {
        socket.emit("deleteProductError", "Error al eliminar el producto.");
      }
    });
    
    
    socket.on("chatMessage",isUser, async (messageData) => {
      const { usuario, message } = messageData;
    
      if (req.isAuthenticated() && req.user.role === "user") {
        // El usuario está autenticado y tiene el rol "user"
        const nuevomensaje = new Mesagge({ usuario, message });
    
        try {
          await nuevomensaje.save();
          socket.emit("chatMessage", { usuario, message });
          console.log(`Mensaje guardado en la base de datos: ${usuario}: ${message}`);
        } catch (error) {
          console.error("Error al guardar el mensaje en la base de datos:", error);
          socket.emit("chatMessageError", "Error al guardar el mensaje en la base de datos.");
        }
      } else {
        // El usuario no está autenticado o no tiene el rol "user"
        socket.emit("chatMessageError", "Acceso no autorizado para enviar mensajes.");
      }
    });
       
  });

// loggers

app.get("/loggerTest", (req, res) => {
  console.log("Console log");
  logger.debug("Debug");
  logger.http("Http");
  logger.info("info");
  logger.warning("Warning");
  logger.error("Error");
  logger.fatal("Fatal");
  res.send("loggertest");
});