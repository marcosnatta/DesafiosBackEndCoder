import { Router } from "express";
import  userModel  from "../DAL/mongoDB/models/user.model.js";
import { hashData } from "../utils.js";
import { compareData } from "../utils.js";
import passport from "passport";
import UsersDto from "../DAL/DTOs/users.dto.js";
import { userMongo } from "../DAL/DAOs/mongoDAOs/userMongo.js";
import InactiveUserService from "../services/userinactive.service.js"
import { CartsMongo } from '../DAL/DAOs/mongoDAOs/CartsMongo.js';

const router = Router();
const cartsMongo = new CartsMongo();


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
  
  const isPremium =
    email === "marcos.natta@gmail.com" && password === "12345";
  
  const hashPassword = await hashData(password);
  const user = {
    first_name,
    last_name,
    email,
    age,
    password: hashPassword,
    role: isAdmin ? "ADMIN" : isPremium ? "premium" : "user",
  };
  const result = await userModel.create(user);
  res.send({ status: "succes", message: "Usuario registrado correctamente" });
});

//http://localhost:8080/session/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).send({ status: "error", error: "Datos incorrectos" });
    }

    const isPasswordValid = await compareData(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Usuario o contraseña no válidos" });
    }

    user.lastConnection = new Date();

    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
      user.role = "ADMIN";
    }

    const existingCart = await cartsMongo.getCartByUserId(user._id);

    req.session.user = {
      _id: user._id,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      age: user.age,
      role: user.role,
      cartId: existingCart ? existingCart._id : null,
    };

    req.session.cartId = req.session.user.cartId;

    if (!existingCart) {
      console.log('No se encontró un carrito existente para el usuario. Creando uno nuevo...');
      const newCart = await cartsMongo.createCartForUser(user._id);
      console.log('Nuevo carrito creado para el usuario:', newCart);

      req.session.user.cartId = newCart._id;
      req.session.cartId = newCart._id;
    }

    await user.save();
    res.cookie('usuario', req.session.user.email);
    res.redirect("/api/products");
  } catch (error) {
    console.error("Error durante la autenticación:", error);
    res.status(500).json({ status: "error", error: "Error interno del servidor" });
  }
});

// get http://localhost:8080/session/logout
router.get("/logout", async (req, res) => {
  try {
    const cartId = req.session.cartId;
    const userId = req.session.user ? req.session.user._id : null;

    console.log("Cerrando sesión. CartId:", cartId, "UserId:", userId);

    if (cartId && userId) {
      const cart = await cartsMongo.getCartById(cartId);

      console.log("Obteniendo información del carrito:", cart);

      if (cart && cart.user && cart.user.toString() === userId.toString()) {
        await cartsMongo.deleteCart(cartId);
        console.log(`Carrito ${cartId} eliminado al cerrar sesión.`);
      }
    }
    
    req.session.cartId = null;
    req.session.user = null;

    console.log("Sesión destruida. Redireccionando a /login.");
    
    req.session.destroy((err) => {
      if (err) {
        return res
          .status(500)
          .send({ status: "error", error: "No pudo cerrar sesión" });
      }

      res.redirect("/login");
    });
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    res.status(500).json({ status: "error", error: "Error interno del servidor" });
  }
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
   (req, res) => {
    req.session.user = req.user;
    res.redirect("/profile");
  }
);

router.get("/current", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Usuario no autenticado" });
  }

  const userDto = new UsersDto(req.session.user); 
  res.status(200).json({ user: userDto });
});

// users
router.get('/users', async (req, res) => {
  // http://localhost:8080/session/users
  try {
    const projection = { first_name: 1, email: 1, role: 1 };
    const users = await userMongo.find({}, projection);
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.delete('/deletedUsers', async (req, res) => {
  try {
    const inactiveUsers = await InactiveUserService.getInactiveUsers();

    if (inactiveUsers.length > 0) {
      await InactiveUserService.deleteInactiveUsers(inactiveUsers);
      await InactiveUserService.sendInactiveUserEmails(inactiveUsers);

      res.status(200).json({ message: 'Usuarios inactivos eliminados y notificados' });
    } else {
      res.status(200).json({ message: 'No hay usuarios inactivos para eliminar' });
    }
  } catch (error) {
    console.error('Error al eliminar usuarios inactivos:', error);
    res.status(500).json({ error: 'Error interno del servidor al procesar la solicitud' });
  }
});


// ruta a seguir http://localhost:8080/session/users/premium/id del usuario
router.put("/users/premium/:uid", async (req, res) => {
  try {
    const uid = req.params.uid;
    const { role } = req.body;

    const validRoles = ['user', 'premium', 'ADMIN'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Rol no válido" });
    }

    const updatedUser = await userModel.findOneAndUpdate(
      { _id: uid },
      { $set: { role: role } },
      { new: true }
    );
    if (req.session) {
      req.session.user = {
        name: `${updatedUser.first_name} ${updatedUser.last_name}`,
        email: updatedUser.email,
        age: updatedUser.age,
        role: updatedUser.role,
      };
    
      req.session.save((err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "Error al guardar la sesión" });
        } else {
          res.status(200).json({
            message: `Rol de usuario actualizado exitosamente a ${role}`,
            user: {
              _id: updatedUser._id,
              role: updatedUser.role,
            },
          });
        }
      });
    } else {
      res.status(500).json({ error: "Sesión no definida al actualizar el rol del usuario" });
    }    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
