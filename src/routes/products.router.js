import { Router } from "express";
import { ObjectId } from "mongodb"
import {productsMongo} from "../managers/products/ProductsMongo.js"

const router = Router();



router.get("/", async (req, res) => {

  try {
    const allproducts = await productsMongo.findAll()
    if (!req.query.limit) {
        res.status(200).json({ message: "productos", allproducts })
    } else{
        res.status(200).json({message:"productos", seleccionados: allproducts.slice(0,Number(req.query.limit))})
	} 
}catch (error){
    res.status(500).json({message:"tenemos un error"})
	}
});




router.get("/:pid", async (req, res) => {
    const { pid } = req.params
    const prodId = new ObjectId(pid)
    try {
    const product = await productsMongo.findById(prodId);

    res.status(200).json({message:"id del producto", product});    
  } catch (error) {
    res.status(500).json({error})
  }
});


router.post("/",async(req,res)=>{

    const { title, description, price, thumbnail, code, stock, category } = req.body;

    if(!title || !description || !price || !thumbnail || !code || !stock || !category ){
        return res.status(400).json({message: "faltan datos del producto"})
    }
    
    try {
        const newProduct = await productsMongo.createProduct(req.body)
        res.status(200).json({message: "producto creado", producto: newProduct})
    } catch (error) {
        res.status(500).json({error})
    }
 })


router.delete("/:pid",async(req,res)=>{
    const { pid } = req.params
try {
    const deleteProducts = await manager.deleteProduct(+pid)
    res.status(200).json({message:"producto borrado"})
} catch (error) {
    res.status(500).json({ error })
}
})

router.put("/:pid",async(req,res)=>{
    const { pid } = req.params

    try {
        const updateproduct = await manager.updateProduct(+pid,req.body)
        res.status(200).json({message: "producto actualizado"})
    } catch (error) {
        res.status(500).json({ error })
    }
})
export default router


/*
 const newProduct = await productsMongo.createProduct(title, description, price, thumbnail, code, stock, status, category);
        res.status(200).json({ message: "producto creado ", product: newProduct })
        console.log(newProduct)
    } catch (error) {
        res.status(500).json({ error })
        console.log(error)
    }
    */