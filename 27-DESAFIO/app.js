const express = require("express")
const app = express();
const server = require("http").Server(app);
const User = require("./user.schema")
const port = 6000
const mongoose = require("mongoose")
const session = require("express-session")
const cookieParser = require("cookie-parser")
const mongoStore = require("connect-mongo")
const  passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const bCrypt = require("bcrypt")

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
  "login",
  new LocalStrategy(
    {
      passReqToCallback: true,
    },
    (req, username, password, done) => {
      User.findOne({ username: username }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          console.log("User Not Found with username " + username);
          console.log("message", "User Not found.");
          return done(null, false);
        }
        if (!isValidPassword(user, password)) {
          console.log("Invalid Password");
          console.log("message", "Invalid Password");
          return done(null, false);
        }
        return done(null, user);
      });
    }
  )
);

const isValidPassword = (user, password) => {
  return bCrypt.compareSync(password, user.password);
};

passport.use(
  "register",
  new LocalStrategy(
    {
      passReqToCallback: true,
    },
    (req, username, password, done) => {
      const findOrCreateUser = () => {
        User.findOne({ username: username }, (err, user) => {
          if (err) {
            console.log("Error in SignUp: " + err);
            return done(err);
          }
          if (user) {
            console.log("User already exists");
            console.log("message", "User Already Exists");
            return done(null, false);
          } else {
            const newUser = new User();
            newUser.username = username;
            newUser.password = createHash(password);
            newUser.save((err) => {
              if (err) {
                console.log("Error in Saving user: " + err);
                throw err;
              }
              console.log("User Registration succesful");
              return done(null, newUser);
            });
          }
        });
      };
      process.nextTick(findOrCreateUser);
    }
  )
);

const createHash = (password) => {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
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

server.listen(port, function () {
        console.log("Servidor corriendo en http://localhost:" + port);
      });
