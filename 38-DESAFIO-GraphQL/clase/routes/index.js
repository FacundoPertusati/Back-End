var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const products = {
  items: [{
    "id": 1,
    "name": "papa",
    "price": "232"
  },
  {
    "id": 2,
    "name": "aguacate",
    "price": "232"
  }]
}
router.post("/products", (req,res) => {

    const {name, price} = req.body

    products.items.push({
      id: products.items.length + 1,
      name: name,
      price: price
    })

    res.json(products.items[products.items.length-1])


})

router.get("/products", (req, res) => {
  if(products.items == 0) {
    res.json("No existen productos disponibles")
  } else {
    res.json(products.items)
  }
})

module.exports = router;
