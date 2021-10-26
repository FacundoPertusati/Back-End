var sqlite3 = require('sqlite3').verbose();
var express = require('express');
const path = require("path");
var app = express();
const db_name = path.join(__dirname, "../DB", "productos.db");
const db = new sqlite3.Database(db_name, err => {
    if (err) {
        return console.error(err.message);
    }
    console.log("Successful connection to the database 'productos.db'");
});

app.use(express.urlencoded({ extended: false }));

class Sqlite {

    connectDB(){
        
const sql_create = `CREATE TABLE IF NOT EXISTS productos(
  producto_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(100) NOT NULL,
  code INTEGER,
  picture VARCHAR(100) NOT NULL,
  price INTEGER,
  stock INTEGER);`;
db.run(sql_create, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Successful creation of the 'Productos' table");
});

  // Database seeding
  const sql_insert = `INSERT INTO productos (producto_ID, name, description, code, picture, price, stock) VALUES
  (1, 'cafe', 'coffe beans', 100, 'coffee.png', 150, 100),
  (2, 'croissant', 'warm croissant', 101, 'croissant.png', 200, 100),
  (3, 'chocotorta', 'chocolate ganash and chocolate cookies', 102, 'chocotorta.png', 300, 100);`;
  db.run(sql_insert, err => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Successful creation of 3 productos");
  });

    }

 show (req, res){
    try{
      const sql = `SELECT * FROM productos ORDER BY producto_id`
      db.all(sql, [], (err, rows) => {
        if (err) {
         res.json(err);
        }
        res.status(200).json({ model: rows } );
        // console.log( {model: rows})
    });

    }catch(err) {
        console.error(err)
    }
   
}

showId (req, res) {
  const id = req.params.id;
  const sql = "SELECT * FROM productos WHERE producto_ID = ?";
  db.get(sql, id, (err, row) => {
    // if (err) ...
    res.status(200).json({ model: row });
  });
};


update (req, res){
  const id = req.params.id;
  console.log(id)
  const producto = [req.body.name, req.body.description, req.body.code, req.body.picture, req.body.price, req.body.stock, id];
  console.log([req.body.name, req.body.description, req.body.code, req.body.picture, req.body.price, req.body.stock, id])
  const sql = "UPDATE productos SET name = ?, description = ?, code = ?, picture = ?, price = ?, stock = ? WHERE (producto_ID = ?)";
  db.run(sql, producto, (err, row) => {
   if(err){
     console.log(err)
   }else{
     res.status(200).json('product updated');

   }
  
  });
  
};

create (req, res){
  const sql = `INSERT INTO productos ( name, description, code, picture, price, stock) VALUES ( ?, ?, ?, ?, ?, ?)`;
  const producto = [req.body.name, req.body.description, req.body.code, req.body.picture, req.body.price, req.body.stock];
  console.log([req.body.name, req.body.description, req.body.code, req.body.picture, req.body.price, req.body.stock])
  db.run(sql, producto, err => {
  if(err){
    console.log(err)
  }else{
    res.status(200).json(producto);

  }
  
  });
};
 
// POST /delete/5
delete (req, res){
  const id = req.params.id;
  const sql = "DELETE FROM productos WHERE producto_ID = ?";
  db.run(sql, id, err => {
    // if (err) ...
    res.json(`product deleted`)
  });
};

}

module.exports = Sqlite