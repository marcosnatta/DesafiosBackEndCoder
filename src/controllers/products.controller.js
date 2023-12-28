import { productsService } from "../services/products.service.js";

class ProductController {
  async addProduct(req, res) {
    try {
      const newProduct = await productsService.addProduct(req.body);
      res.status(201).json({ product: newProduct });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async findAll(req, res) {
    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;

    try {
      const products = await productsService.findAll({}, {}, limitNumber, pageNumber);
      res.status(200).json({ products });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async findById(req, res) {
    const { id } = req.params;
    try {
      const product = await productsService.findById(id);
      console.log(product)
      if (product) {
        res.status(200).json({ product });
      } else {
        res.status(404).json({ message: 'Producto no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

async updateProduct(req, res) {
  const { id } = req.params;
  const updateprod = req.body;

  try {
    delete updateprod._id;

    const updatedProduct = await productsService.updateProduct(id, updateprod);
    if (updatedProduct) {
      res.status(200).json({ product: updatedProduct });
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}




  async deleteProduct(req,res){
    const { id } = req.params;
    try {
      const deleted = await productsModel.findByIdAndDelete(id);

        return deleted
    } catch (error) {
        return error
    }
  }
}
 export const productController = new ProductController