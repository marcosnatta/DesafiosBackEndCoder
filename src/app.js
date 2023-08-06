import express from "express"
import ProductManager  from "./ProductManager.js";
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"
import {__dirname} from "./utils.js"
import handlebars from "express-handlebars"
import viewsRouter from "./routes/views.router.js"
import {Server} from "socket.io"
 
const app = express()
const manager = new ProductManager("./productos.json")

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

socketServer.on("connection", (socket)=>{
    console.log("cliente conectado", socket.id)
    socket.on("disconnect",()=>{
        console.log("cliente desconectado")
    })

    const productonuevo = []
    socket.on('producto nuevo',infoproduct=>{
        productonuevo.push(infoproduct)
        socketServer.emit("realTimeProducts",productonuevo)
      })
})