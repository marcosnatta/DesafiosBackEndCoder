import { Router } from "express";
import  userModel  from "../DAL/mongoDB/models/user.model.js";
import { hashData } from "../utils.js";
import { compareData } from "../utils.js";
import passport from "passport";
import UsersDto from "../DAL/DTOs/users.dto.js";

const router = Router();

router.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  const exist = await userModel.findOne({ email });

  if (exist) {
    return res
      .status(400)
      .send({ status: "error", error: "El usuario ya existe" });
  }
  const isAdmin =
    email === "adminCoder@coder.com" && password === "adminCod3r123";
  const hashPassword = await hashData(password);
  const user = {
    first_name,
    last_name,
    email,
    age,
    password: hashPassword,
    role: isAdmin ? "ADMIN" : "user",
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
  }else {
    user.role = "user";
  }

  req.session.user = {
    name: `${user.first_name} ${user.last_name}`,
    email: user.email,
    age: user.age,
    role: user.role,
  };
  req.session[`email`] = email;
  //res.send({status:"success", payload:req.res.user, message:"Bienvenido"})
  res.redirect("/api/products");
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
    failureRedirect: "/login",
  }),
  async (req, res) => {
    req.session.user = req.user;
    res.redirect("/profile");
  }
);

router.get("/current", (req, res) => {
  const userDto = new UsersDto(req.session.user); 
  console.log(userDto)
  res.status(200).json({ user: userDto });
});
export default router;
