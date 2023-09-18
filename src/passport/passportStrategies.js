import passport from "passport";
import  userModel from "../persistencia/models/user.model.js";
import {Strategy as LocalStrategy} from 'passport-local'
import { Strategy as GithubStrategy } from 'passport-github2'
import {compareData} from "../utils.js"

//estrategia local de passport
passport.use('login',new LocalStrategy(
  async function(email,password,done){
      try {
          const user = await userModel.findOne(email)
          if(!user){
              return done(null,false)
          }
          //si el usuario existe comparo las pass
          const isPasswordValid = await compareData(password, user.password)
          if(!isPasswordValid){
              return done(null,false)
          }
          return done(null,user)
          
      } catch (error) {
          done(error)
      }
  }
))


//passport con github
passport.use(new GithubStrategy({
  clientID: 'Iv1.0850279be97932f8',
  clientSecret: 'dfd55cc0de2a515ea9cdff3673533c66b3c7ea09',
  callbackURL: "http://localhost:8080/users/github"
},
async function(accessToken, refreshToken, profile, done) {
  try {
      const user = await userModel.findOne(profile.email) 
      //login
      if(user ){
          if(user.fromGithub){
              return done(null,user)
          } else {
              return done(null,false)
          }
      }
      // registro
      const newUser = {
          first_name: profile.displayName.split(' ') [0],
          last_name: profile.displayName.split(' ') [1],
          email: profile.email,
          password: ' ',
          fromGithub: true
      }
      const result = await userModel.create(newUser)
      return done(null,result)
  } catch (error) {
      done(error)
  }
}
))
// cookies

const cookieExtractor= (req)=>{
  return req.cookies.token
}



// user => id
passport.serializeUser((usuario, done) => {
  done(null, usuario._id);
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
