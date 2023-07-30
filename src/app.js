import express from "express"
import  ProductManager  from "./ProductManager.js";
import productsRouter from "./routes/products.router.js"
const app = express()
const manager = new ProductManager("./productos.json")
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/", productsRouter)

app.listen(8080, ()=>{
    console.log("escuchando el puerto 8080")
})

