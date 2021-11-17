const express = require("express");
const app = express();
const server = require("http").Server(app);
const moment = require('moment')
const port = 8080
const {router} = require("./routes/router")
const User = require("./schemas/user.schema")
const mongoose = require("mongoose")

app.use(router)

// const User = require("./schemas/user.schema")

// DEPENDENCIES DB FOR SESSION
const mongoStore = require("connect-mongo")

// DEPENDENCIES SESSION
const session = require("express-session")
const cookieParser = require("cookie-parser")

// DEPENDENCIES PASSPORT
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const bCrypt = require("bcrypt")
const FacebookStrategy = require("passport-facebook").Strategy;


// FACEBOOK ID SECRET

const FACEBOOK_CLIENT_ID = "216722747223189";
const FACEBOOK_CLIENT_SECRET = "b49103a52c7d0250d4d96ff24eb599b7";

app.set('views','./views');
app.set('view engine','ejs');

app.use(cookieParser());
const advancedOptions = {useNewUrlParser: true, useUnifiedTopology: true}

app.use(session({
  store: mongoStore.create({
    mongoUrl: "mongodb+srv://coladmin:mosorio12@cluster0.kduye.mongodb.net/desafio26?retryWrites=true&w=majority",
    mongoOptions: advancedOptions
  }),
  secret: "djjfj",
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge: 600000}
}
))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use(passport.initialize())
app.use(passport.session())
  

function connectDB() {

    console.log("soy atlas")

    try{
       mongoose.connect("mongodb+srv://coladmin:mosorio12@cluster0.kduye.mongodb.net/desafio26?retryWrites=true&w=majority",
         {
             useNewUrlParser: true,
             useUnifiedTopology: true
         }
     );
     console.log('Database connected')

    }
    catch(error){
        throw new Error(error)
    }
}

 connectDB()

 passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_CLIENT_ID,
      clientSecret: FACEBOOK_CLIENT_SECRET,
      callbackURL: "/facebook-login/callback",
      profileFields: ["id", "displayName", "photos", "emails"],
      scope: ["email"],
    },
    (accessToken, refreshToken, profile, done) => {
      let userProfile = profile;
      return done(null, userProfile);
    }
  )
);

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});


app.get("/facebook-login", passport.authenticate("facebook"));
app.get(
      "/facebook-login/callback",
      passport.authenticate("facebook", {
        successRedirect: "/vista",
        failureRedirect: "/faillogin",
      })
    );

app.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/faillogin" }),
  (req, res) => {
    let { nombre } = req.body;
    req.session.nombre = nombre;
    res.redirect("/vista");
  }
);


app.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/failregister" }),
  (req, res) => {
    res.redirect("/");
  }
);

function checkAuthentication(req,res,next){
  if(req.isAuthenticated()){
      next();
  } else{
      res.redirect("/");
  }
}

app.get("/vista", async (req, res) => {
  if (req.isAuthenticated()) {
    const nombre = req.user.displayName;
    const foto = req.user.photos[0].value;
    const email = req.user.emails[0].value;
    console.log(nombre, foto, email)
    try {
      const cant = req.query.cant;
      if (cant === "0") {
        res.render("vista", { nombre, foto, email });
      } else if (!cant) {
        res.render("vista", {
          nombre,
          foto,
          email,
        });
      } else {
        res.render("vista", {
          nombre,
          foto,
          email,
        });
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    res.sendFile(process.cwd() + "/public/login.html");
  }
});


app.get("/logout", (req, res) => {
  let nombre = req.user.username;
  if (nombre) {
    req.session.destroy((err) => {
      if (!err) res.render("logout", { nombre });
      else res.redirect("/");
    });
  } else {
    res.redirect("/");
  }
});


// Wrong routes msgs

const wrongMsg = {"error":"ruta equivocada"}
app.get("**",(req,res)=>{
    res.status(200).json(wrongMsg)
})
app.post("**",(req,res)=>{
    res.status(200).json(wrongMsg)
})
app.delete("**",(req,res)=>{
    res.status(200).json(wrongMsg)
})


// DEPENDENCIES REAL TIME
const io = require("socket.io")(server);

// io.on("connection", function (socket) {
  //     console.log("Alguien se ha conectado con Sockets");
//     db.readMessage().then(data => {
//     socket.emit("mensajes", data);
//     })
//     socket.on("new-mensaje", function(data){
    
//         db.createMessage(data)
//         db.readMessage().then(data => {
//           console.log(data)
//         io.sockets.emit("mensajes", data);
//     });
// });
// });

server.listen(port, function () {
  console.log("Servidor corriendo en http://localhost:" + port);
});





