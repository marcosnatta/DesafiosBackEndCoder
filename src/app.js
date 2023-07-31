import express from "express"
import ProductManager  from "./ProductManager.js";
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"

const app = express()
const manager = new ProductManager("./productos.json")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)

app.listen(8080, ()=>{
    console.log("escuchando el puerto 8080")
})

