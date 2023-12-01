import passport from "passport";
import userModel from "../DAL/mongoDB/models/user.model.js";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { compareData } from "../utils.js";
import { userMongo } from "../DAL/DAOs/mongoDAOs/userMongo.js";


//estrategia local de passport
passport.use(
  "login",
  new LocalStrategy(async function (username, password, done) {
    try {
      const user = await userMongo.findUser(username);
      if (!user) {
        console.log("Usuario no encontrado:", username);
        return done(null, false);
      }
      const isPasswordValid = await compareData(password, user.password);
      if (!isPasswordValid) {
        return done(null, false);
      }
      console.log("Usuario autenticado:", username);
      return done(null, user);
    } catch (error) {
      done(null, false, { message: 'Error al autenticar usuario' });
    }
  })
);

//passport con github
passport.use(
  new GithubStrategy(
    {
      clientID: "Iv1.0850279be97932f8",
      clientSecret: "dfd55cc0de2a515ea9cdff3673533c66b3c7ea09",
      callbackURL: "http://localhost:8080/session/github",
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        const user = await userMongo.findUser(profile.username);
        //login
        if (user) {
          if (user.fromGithub) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        }
        // registro
        const newUser = {
          first_name: profile.displayName.split(" ")[0],
          last_name: profile.displayName.split(" ")[1],
          email: profile.email,
          password: " ",
          fromGithub: true,
        };
        const result = await userMongo.create(newUser);
        return done(null, result);
      } catch (error) {
        done(error);
      }
    }
  )
);


// user => id
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// id => user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});