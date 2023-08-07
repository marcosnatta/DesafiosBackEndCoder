import express from "express"
import ProductManager  from "./ProductManager.js";
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"
import {__dirname} from "./utils.js"
import handlebars from "express-handlebars"
import viewsRouter from "./routes/views.router.js"
import {Server} from "socket.io"
 
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
const manager = new ProductManager("./productos.json")


//agregar un producto nuevo
socketServer.on("connection", (socket) => {
    console.log("Cliente conectado:", socket.id);
    socket.on("addProduct", async (nuevoproduct) => {
      try {
        const agregarProducto = await manager.addProduct(
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
        const result = await manager.deleteProduct(ProdId);
        if (result === "producto con id no encontrado") {
          socket.emit("deleteProductError", result);
        } else {
          socketServer.emit("deleteProductSuccess", ProdId);
        }
      } catch (error) {
        socket.emit("deleteProductError", "Error al eliminar el producto.");
      }
    });
    
  });