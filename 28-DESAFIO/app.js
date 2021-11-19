const express = require("express")
const app = express();
const server = require("http").Server(app);
const { PORT, secret, mongodb, facebook } = require('./config')
const mongoose = require("mongoose")
const session = require("express-session")
const cookieParser = require("cookie-parser")
const mongoStore = require("connect-mongo")
const  passport = require('passport')
const FacebookStrategy = require("passport-facebook").Strategy;
const bCrypt = require("bcrypt")
const router = require("./router")


app.set('views','./views');
app.set('view engine','ejs');

app.use("/", router)
// SET PROCESS
app.set('port', process.env.PORT || PORT)

app.use(cookieParser());
const advancedOptions = {useNewUrlParser: true, useUnifiedTopology: true}

app.use(session({
  store: mongoStore.create({
    mongoUrl: "mongodb+srv://coladmin:mosorio12@cluster0.kduye.mongodb.net/desafio28?retryWrites=true&w=majority",
    mongoOptions: advancedOptions
  }),
  secret: secret,
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
  
//Connection

const connectDB = async () => {

    console.log("soy atlas")

    try{
       await mongoose.connect(mongodb.URL, mongodb.advancedOptions);
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
      clientID: facebook.id,
      clientSecret: facebook.secret,
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


app.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/faillogin" }),
  (req, res) => {
    let { nombre } = req.body;
    req.session.nombre = nombre;
    res.redirect("/");
  }
);

app.get("/facebook-login", passport.authenticate("facebook"));
app.get(
      "/facebook-login/callback",
      passport.authenticate("facebook", {
        successRedirect: "/vista",
        failureRedirect: "/faillogin",
      })
    );


app.get("/faillogin", (req, res) => {
  res.render("logininvalid");
});

app.get("/login", (req, res) => {
    res.send("holi")
})

app.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/failregister" }),
  (req, res) => {
    res.redirect("/login");
  }
);

      server.listen(app.get('port'), err => {
        if (err) throw new Error(`Error en el servidor ${err}`)
        console.log(`Servidor corriendo en http://localhost:`, app.get('port'))
    })

    