const fs = require(`fs`);

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    try {
      const productosPrev = await this.getProducts();
      
      if (!title || !description || !price || !thumbnail || !code || !stock) {
        return console.log("Todos los campos son obligatorios");
      }
      if (this.productosPrev.find((p) => code === p.code)) {
        return console.log("ya existe ese code");
      }

      let id;
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
      };

      productosPrev.push(newProduct);
      
      await fs.promises.writeFile(this.path, JSON.stringify(productosPrev));
      
    } catch (error) {
      return error
    }
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
  

  getProductById(id) {
    const productoId = this.productosPrev.find((p) => p.id === id);
    if (productoId === undefined) {
      console.log("el producto no existe");
    } else {
      return productoId;
    }
  }
}


const producto1 ={
  title: "producto prueba",
  description: "este es un producto prueba",
  price: 200,
  thumbnail: "sin imagen",
  code: "abc 123",
  stock: 25
}


async function prueba() {
  const pruebas = new ProductManager(`productos.json`);

  await pruebas.addProduct(producto1.title,
    producto1.description,
    producto1.price,
    producto1.thumbnail,
    producto1.code,
    producto1.stock)




  //producto1.addProduct() (metodo para verificar que los campos son obligatorios)
  //console.log(producto1.getProducts(2));
  //console.log(producto1.getProductById(3)) //metodo para verificar que el id no existe
}


prueba()
