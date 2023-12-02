import supertest from "supertest";
import { expect } from "chai";

const requester = supertest("http://localhost:8080");

describe("sessions endpoint", () => {
  let userCredentials;

  describe("POST /register", () => {
    const newuser = {
      first_name: "prueba test",
      last_name: "natta test",
      email: "test@mail.com",
      age: 25,
      password: "hola",
    };

    it("register new user", async () => {
      const response = await requester.post("/session/register").send(newuser);

      console.log('Response status:', response.status);
      console.log('Response body:', response.body);

      expect(response.status).to.equal(200);
      userCredentials = {
        email: newuser.email,
        password: newuser.password,
      };
    });
  });

  describe("POST /login", () => {
    it("login with newly created user", async () => {
      const loginResponse = await requester.post("/session/login").send(userCredentials);

      console.log('Login response status:', loginResponse.status);
      console.log('Login response body:', loginResponse.body);

      expect(loginResponse.status).to.equal(302);
      expect(loginResponse.headers.location).to.equal("/api/products");
    });
  });
});
