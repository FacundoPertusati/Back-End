const conectarMaria = require('./mariadb')
const sqlite3 = require('sqlite3').verbose()
const knex = require('knex')(conectarMaria)

let db = new sqlite3.Database('./db/messages.sqlite', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connectado a DB SQLITE');
});
db.serialize(() => {
  db.each(`

  DROP TABLE IF EXISTS  "mensajes";
  
  CREATE TABLE "mensajes"
  (
      [Id] INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      [name] NVARCHAR(160)  NOT NULL,
      [mensaje] NVARCHAR(160) NOT NULL,
      FOREIGN KEY ([Id]) REFERENCES "ID" ([Id])
                  ON DELETE NO ACTION ON UPDATE NO ACTION
  );`, (err, row) => {
    if (err) {
      console.error(err.message);
    }
   
  });
});
db.close((err) => {
  if (err) {
    return console.error(err.message);
  }

});





knex.schema.hasTable("lista").then(exist => {
  if(!exist) {

    return knex.schema.createTable('lista', (table)=> {
      table.increments("id").primary();
      table.datetime("date", { precision: 6 }).defaultTo(knex.fn.now(6));
      table.string("name", 100).notNullable();
      table.string("description", 250);
      table.integer("code").notNullable();
      table.string("picture", 255);
      table.integer("price").notNullable();
      table.integer("stock").notNullable();
  }).then (
      (console.log('tabla creada'),
  
  
      (err) => console.log(err),
      () => knex.destroy())
  )
  }
})

knex.schema.hasTable("carrito").then(exist => {
  if(!exist) {

    return knex.schema.createTable('carrito', (table)=> {
      table.increments("id").primary();
      table.datetime("date", { precision: 6 }).defaultTo(knex.fn.now(6));
  }).then (
      (console.log('tabla creada'),
  
      (err) => console.log(err),
      () => knex.destroy())
    )
  } 
    
  })

  knex.schema.hasTable("relprod").then(exist => {
    if(!exist) {
  
      return knex.schema.createTable('relprod', (table)=> {
        table.integer("id-carrito");
        table.integer("id-producto");
        table.integer("qty");
        table.datetime("date", { precision: 6 }).defaultTo(knex.fn.now(6));
    }).then (
        (console.log('tabla creada'),
    
  
      (err) => console.log(err),
      () => knex.destroy())
    )
    } 
      
    })
    

    

module.exports = {knex, conectarMaria}