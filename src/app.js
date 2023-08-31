import express from "express"
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"
import {__dirname} from "./utils.js"
import handlebars from "express-handlebars"
import viewsRouter from "./routes/views.router.js"
import {Server} from "socket.io"
import "./db/dbConfig.js"
import {productsMongo} from "./managers/products/ProductsMongo.js"
import {Mesagge} from "./db/models/messages.model.js"
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname +"/public"))

//parte de handlebars
app.engine("handlebars", handlebars.engine())
app.set("views", __dirname +"/views")
app.set("view engine","handlebars")


// mis routers
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("/", viewsRouter)


const PORT = 8080
const httpServer = app.listen(PORT, ()=>{
    console.log(`escuchando el puerto ${PORT}`)
})

const socketServer = new Server(httpServer)


// chat
app.get("/chat", (req, res) => {
  res.render("chat", { messages: [] }); 
});


//agregar un producto nuevo
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
    
    
    socket.on("chatMessage", async (messageData) => {
      
      const { usuario, message } = messageData;
      const nuevomensaje = new Mesagge({ usuario, message });
    
      try {
        await nuevomensaje.save();
        socket.emit("chatMessage", { usuario, message });
        console.log(`Mensaje guardado en la base de datos: ${usuario}: ${message}`);
      } catch (error) {
        console.error("Error al guardar el mensaje en la base de datos:", error);
        socket.emit("chatMessageError", "Error al guardar el mensaje en la base de datos.");
      }
    });
  });