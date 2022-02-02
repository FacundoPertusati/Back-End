require('dotenv').config()
const express = require("express");
const app = express();
const server = require("http").Server(app);
const moment = require('moment')
const port = process.env.SERVER_PORT || 8080
const {router} = require("./routes/router")
const User = require("./schemas/user.schema")
const { Mongo } = require("./db/db")
const { TwilioCom } = require("./controllers/twilio")
const multer = require("multer")

 const runDB = new Mongo
 runDB.connectDB()

const email = "dimematthe@gmail.com"

var upload = multer();

let storage = multer.diskStorage ({
  destination: function (req, file, cb){
    cb(null, path.join(__dirname, '/public/uploads/'));
  },
  filename:function(req, file, callback){
      callback(null, file.originalname)
  }
})
let uploadFile = multer({storage})

const waa = new TwilioCom()

async function subirAvatar (req, res){
  const data = await User.findOneAndUpdate({email: req.session.username},{avatar: req.file.filename}, {new: true})
  res.json(data)
}


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



app.set('views','./views');
app.set('view engine','ejs');

app.use(cookieParser());
const advancedOptions = {useNewUrlParser: true, useUnifiedTopology: true}

app.use(session({
  store: mongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    mongoOptions: advancedOptions
  }),
  secret: "djjfj",
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge: 6000000}
}
))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use(passport.initialize())
app.use(passport.session())
  



 passport.use(
  "login",
  new LocalStrategy(
    {
      passReqToCallback: true,
    },
    (req, email, password, done) => {
      User.findOne({ email: email}, (err, user) => {
        if (err) {
          waa.enviarMsg("Ha iniciado sesión el usuario registrado con el correo " + email)
          return done(err);
        }
        if (!user) {
          console.log("User Not Found with E-mail " + email);
          console.log("message", "User Not found.");
          return done(null, false);
        }
        if (!isValidPassword(user, password)) {
          console.log("Invalid Password");
          console.log("message", "Invalid Password");
          return done(null, false);
        }
        waa.enviarMsg("Ha iniciado sesión el usuario registrado con el correo " + email)
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
      
                (req, email, password, done) => {
                  const findOrCreateUser = () => {
                    
                    User.findOne({ email: email }, (err, user) => {
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
                        newUser.email = email;
                        newUser.password = createHash(password);
                        newUser.address = req.body.address;
                        newUser.age = req.body.age;
                        newUser.prefix = req.body.prefix;
                        newUser.telephone = req.body.telephone;
                        console.log(newUser)
                        newUser.save((err) => {
                          if (err) {
                            console.log("Error in Saving user: " + err);
                            throw err;
                          }
                          waa.enviarMsg("Se ha registrado el email " + email)
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
                let { username } = req.body;
                req.session.username = username;
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
              const {username} = req.session
              res.render("vista", {username})
            })

            app.post("/subirAvatar", uploadFile.single("archivo"), (req, res) => {
              
              subirAvatar(req, res)
          })



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


// require("./axios")
server.listen(port, function () {
  console.log("Servidor corriendo en http://localhost:" + port);
});





