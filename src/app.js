import express from "express"
import  ProductManager  from "./ProductManager.js";

const productmanager = new ProductManager("./productos.json")
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/products', async (req, res) => {
	try{
	const allproducts = await productmanager.getProducts();
	if(!req.query.limit){
		return res.send(allproducts)
	} else{
		return res.send(allproducts.slice(0,Number(req.query.limit)))
	}
	}catch (err){
		res.send({error:"tenemos un error"})
	}
});

app.get('/products/:pid', async (req, res) => {
	try{

		const idproductos =  await productmanager.getProductById(Number(req.params.pid))
		if(idproductos){
			return res.send(idproductos)
		}else{
			return res.send("el producto no se encontro")
		}
	}catch(err){
		res.send({error:"tenemos un error"})
	}
	
});


app.listen(8080, ()=>{
    console.log("escuchando el puerto 8080")
})

