const fs = require("fs");

class ProductManager {
  constructor(path = "./products.json") {
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

  async addProduct(title, description, price, thumbnail, code, stock, prodnew) {
    try {
      const productosPrev = await this.getProducts();
      if (!title || !description || !price || !thumbnail || !code || !stock) {
        return "Todos los campos son obligatorios";
      }

      if (productosPrev.find((p) => code === p.code)) {
        //console.log("ya existe ese code")
        return "ya existe ese code";
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
      productosPrev.push({ ...prodnew, id});

      await fs.promises.writeFile(this.path, JSON.stringify(productosPrev));
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

  async deleteUser(id) {
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

const producto1 = {
  title: "producto prueba",
  description: "este es un producto prueba",
  price: 200,
  thumbnail: "sin imagen",
  code: "abc 123",
  stock: 25,
};

prodnew = {
  title: "este no es una prueba",
  description: "producto que no es de prueba",
  stock: 20303,
};

const producto2 = {
  title: "productos prueba",
  description: "este es otro  producto prueba",
  price: 2001,
  thumbnail: "sin imagen",
  code: "abc 1234",
  stock: 251,
};

const producto3 = {
  title: "otra prueba mas",
  description: "este es otro producto prueba otra vez",
  price: 20,
  thumbnail: "sin imagen",
  code: "abcd 1234",
  stock: 2514,
};

async function prueba() {
  const pruebas = new ProductManager(`productos.json`);

  await pruebas.addProduct(
    producto1.title,
    producto1.description,
    producto1.price,
    producto1.thumbnail,
    producto1.code,
    producto1.stock
  );

  await pruebas.addProduct(
    producto2.title,
    producto2.description,
    producto2.price,
    producto2.thumbnail,
    producto2.code,
    producto2.stock
  );

  await pruebas.addProduct(
    producto3.title,
    producto3.description,
    producto3.price,
    producto3.thumbnail,
    producto3.code,
    producto3.stock
  );
  //const producto = await pruebas.getProducts();
  //const producto = await pruebas.getProductById(1)
  //await pruebas.updateProduct(1,prodnew) // metodo para actualizar un producto tengo un problema que en el json me aparecen dos veces los id
  //console.log(producto);
  //await pruebas.deleteUser(3)
}

prueba();
