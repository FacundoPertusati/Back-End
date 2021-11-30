const express = require("express");
const app = express();
const server = require("http").Server(app);
const moment = require('moment')
const port = 8080
const {router} = require("./routes/router")
const User = require("./schemas/user.schema")
const mongoose = require("mongoose")
const numCPUs = require("os").cpus().length;
const PORT = process.env.PORT || Number(process.argv[2]) || 5050;
const {cluster} = require("cluster")
const modoForkOrCluster = process.argv[5] || "FORK";



app.use(router)


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
    mongoUrl: "mongodb+srv://coladmin:mosorio12@cluster0.kduye.mongodb.net/desafio29?retryWrites=true&w=majority",
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
       mongoose.connect("mongodb+srv://coladmin:mosorio12@cluster0.kduye.mongodb.net/desafio29?retryWrites=true&w=majority",
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
app.get('/vista', checkAuthentication, (req, res) => {
  res.render("vista")
})

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

if (modoForkOrCluster === "CLUSTER" && cluster.isMaster) {
  console.log(numCPUs);
  console.log(`PID MASTER ${process.pid}`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(
      "Worker",
      worker.process.pid,
      "died",
      new Date().toLocaleString()
    );
    cluster.fork();
  });
} else {
  //WORKERS
  server.listen(port, function () {
    console.log("Servidor corriendo en http://localhost:" + port);
  });
    
}

