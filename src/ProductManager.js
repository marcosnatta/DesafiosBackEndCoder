import fs from "fs";


class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts() {
    try {
      if (fs.existsSync(this.path)) {
        const infoProductos = await fs.promises.readFile(this.path, `utf-8`);
        return JSON.parse(infoProductos);
      } else {
        return [];
      }
    } catch (error) {
      return error;
    }
  }

  async addProduct(title, description, price, thumbnail, code, stock, status, category) {
    try {
      if (!title || !description || !price || !thumbnail || !code || !stock) {
        return "Todos los campos son obligatorios";
      }
      const productosPrev = await this.getProducts();
      
      if (productosPrev.find((p) => code === p.code)) {
        return "ya existe ese code";
      }

      let id
      if (!productosPrev.length) {
        id = 1;
      } else {
        id = productosPrev[productosPrev.length - 1].id + 1;
      }
   
      const newProduct = {
        id,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status,
        category
      };
      productosPrev.push(newProduct);
      //productosPrev.push({ ...prodnew, id});

      await fs.promises.writeFile(this.path, JSON.stringify(productosPrev));
      return newProduct
    } catch (error) {
      return error;
    }
  }

  async getProductById(id) {
    try {
      const productosPrev = await this.getProducts();
      const productoId = productosPrev.find((p) => p.id === id);
      if (!productoId) {
        return "producto con id no encontrado";
      }
      return productoId;
    } catch (error) {
      return error;
    }
  }

  async updateProduct(id, prodnew) {
    try {
      const productosPrev = await this.getProducts();
      const productosIndex = productosPrev.findIndex((p) => p.id === id);
      if (productosIndex === -1) {
        return "No hay un producto con ese id";
      }
      const producto = productosPrev[productosIndex];

      productosPrev[productosIndex] = { ...producto, ...prodnew };
      await fs.promises.writeFile(this.path, JSON.stringify(productosPrev));
    } catch (error) {
      return error;
    }
  }

  async deleteProduct(id) {
    try {
      const productosPrev = await this.getProducts();
      const nuevoArrayProductos = productosPrev.filter((p) => p.id !== id);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(nuevoArrayProductos)
      );
    } catch (error) {
      return error;
    }
  }
} 
  



async function prueba() {
  const pruebas = new ProductManager(`productos.json`);

  await pruebas.addProduct("producto1", "prueba1",100,"imagen linda","prod1", 4,true,pruebas);
  /*
  await pruebas.addProduct("producto2", "prueba2",7200,"imagen linda2","prod21", 6,true,pruebas);
  await pruebas.addProduct("producto3", "prueba3",103000,"imagen fea","prod3", 100,true,pruebas);
  await pruebas.addProduct("producto4", "prueba4",1400,"imagen linda3","prod4", 3,true,pruebas);
  await pruebas.addProduct("producto5", "prueba5",7050,"imagen linda4","prod5", 4,true,pruebas);
  await pruebas.addProduct("producto6", "prueba6",106000,"imagen fea2","prod6", 123,true,pruebas);
  await pruebas.addProduct("producto7", "prueba7",1700,"imagen linda5","prod7", 465,true,pruebas);
  await pruebas.addProduct("producto8", "prueba8",7800,"imagen linda6","prod8", 63,true,pruebas);
  await pruebas.addProduct("producto9", "prueba9",109000,"imagen fea3","prod9", 10120,true,pruebas);
  await pruebas.addProduct("producto10", "prueba10",14509000,"imagen fea4","prod10", 1123,true,pruebas);



  //const producto = await pruebas.getProducts();
  //const producto = await pruebas.getProductById(5)
  //await pruebas.updateProduct(1,prodnew) // metodo para actualizar un producto tengo un problema que en el json me aparecen dos veces los id
  //console.log(producto);
  //await pruebas.deleteUser(3)
  */
}
prueba();

export default ProductManager