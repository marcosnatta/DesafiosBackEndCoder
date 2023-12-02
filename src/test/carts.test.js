import supertest from "supertest";
import { expect } from "chai";

const requester = supertest("http://localhost:8080");

describe("carts endpoint", () => {
  describe("GET /api/carts", () => {
    it("shoul return all carts", async () => {
      const response = await requester.get("/api/carts");
      expect(response.status).to.be.equal(200);
      expect(response.body.carts).to.be.an("array");
    });
  });
  
  describe("POST /api/carts", () => {
    const newCart = [];
    it("create a new cart", async () => {
      const response = await requester.post("/api/carts").send(newCart);
      expect(response.status).to.be.equal(200);
      expect(response.body.carts);
    });
  });

  describe("POST /api/carts/cid/products/pid", () => {
    it("add product to cart", async () => {
      const cid = "656a2ab139fe5db325f4f90e"
      const pid = "6530276b7a62cbf3e32ab608";
      const productData = {
        quantity: 1, 
      };
      const response = await requester.post(`/api/carts/${cid}/products/${pid}`).send(productData)
      expect(response.status).to.equal(200);
    });
  });
});
