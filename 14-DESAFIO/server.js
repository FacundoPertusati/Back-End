import { router } from './routes/productos.route.js'
import { routerCarritos } from './routes/carrito.route.js'

import express from "express"
const port = 8080
const app = express()
export const administrador = true

const server = app.listen(port, () => {
    console.log("Corriendo en el puerto " + server.address().port)
})
    
app.use('/api/productos', router);
app.use('/api/carrito', routerCarritos);



app.set('views','./views');
app.set('view engine','ejs');


const error404 = "Estás en el lugar equivocado";
app.get("**", (req,res) => {
    res.status(404).json({"error": error404})
})

app.post("**", (req,res) => {
    res.status(404).json({"error": error404})
})

app.delete("**", (req,res) => {
    res.status(404).json({"error": error404})
})

app.put("**", (req,res) => {
    res.status(404).json({"error": error404})
})

app.use(express.static("public"));




