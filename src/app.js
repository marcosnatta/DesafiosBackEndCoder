import express from "express"
import  ProductManager  from "../ProductManager.js";

const productmanager = new ProductManager("./productos.json")
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/saludo",(req,res) =>{
    console.log(req)
    res.send("hola a todos")
})

app.get("/despedida",(req,res) =>{
    res.send("adios a todos")
})


app.get("/regreso",(req,res) =>{
    res.json({message: "usuarios encontrados", usuarios})
})


app.listen(9090, ()=>{
    console.log("escuchando el puerto 8080")
})

