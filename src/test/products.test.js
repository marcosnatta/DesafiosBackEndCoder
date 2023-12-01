import supertest from "supertest";
import { expect } from "chai";

const requester = supertest("http://localhost:8080");

describe("products endpoint", () => {
  
 describe("POST /api/products", () => {
    const newProduct = {
      title: "prueba test product",
      description: "test product",
      price: 435,
      thumbnail: "imagen test product",
      code: "test product",
      stock: 345,
      category: "test product",
    };
    it("should create a new product", async () => {
      const response = await requester.post("/api/products").send(newProduct);
      expect(response.body).to.exist
    });
  });

  describe("GET /api/products", () => {
      it("should return all the products", async () => {
          const response = await requester.get("/api/products");
         // console.log(response.body)
          expect(response.status).to.equal(200);
          expect(response.body.allproducts.products).to.be.an("array");
      });
  });
 

  describe("PUT /api/products/:pid", () => {
    it("shoul update product", async () => {
      const pid = "65694ada9aee9f57e53e1b1d";
      const updatedProduct = {
        title: "prueba put test",
      };
      const response = await requester
        .put(`/api/products/${pid}`)
        .send(updatedProduct);
      expect(response.status).to.equal(200);
      
    });
  });
});
