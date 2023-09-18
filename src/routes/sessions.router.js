import { Router } from "express";
import userModel from "../persistencia/models/user.model.js";
import { hashData } from "../utils.js";
import { compareData } from "../utils.js";
import passport from "passport";

const router = Router();

router.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  const exist = await userModel.findOne({ email });

  if (exist) {
    return res
      .status(400)
      .send({ status: "error", error: "El usuario ya existe" });
  }
  const isAdmin = email === "adminCoder@coder.com" && password === "adminCod3r123";
  const hashPassword = await hashData(password);
  const user = {
    first_name,
    last_name,
    email,
    age,
    password: hashPassword,
    role: isAdmin ? "ADMIN" : "USER",
  };
  const result = await userModel.create(user);
  res.send({ status: "succes", message: "Usuario registrado correctamente" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return res
      .status(400)
      .send({ status: "error", error: "Datos incorrectos" });
  }
  const isPasswordValid = await compareData(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Username or Password not valid" });
  }

  if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
    user.role = "ADMIN";
    console.log(user.role);
  }

  req.session.user = {
    name: `${user.first_name} ${user.last_name}`,
    email: user.email,
    age: user.age,
    role: user.role,
  };
  req.session[`email`] = email
  //res.send({status:"success", payload:req.res.user, message:"Bienvenido"})
  res.redirect("/products");
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err)
      return res
        .status(500)
        .send({ status: "error", error: "No pudo cerrar sesion" });
    res.redirect("/login");
  });
});

//passport github

router.get(
  "/githubSignup",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github",
  passport.authenticate("github", {
    failureRedirect: "/api/views",
    successRedirect: "/api/views/home",
  }))

export default router;
