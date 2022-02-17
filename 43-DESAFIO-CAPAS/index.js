import  express  from "express";
import { PORT } from "./config/constants.js"
import { router } from "./routes/router.js"
const app = express()

// Reading body inputs for post
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Including 1st Layer => Router
app.use(router)

// Launch server

const server = app.listen(PORT, function () {
    console.log(`You're running the server on http://localhost:${server.address().port}`)
})
