var express = require('express');
const createError = require('http-errors');
const { route } = require('.');
const pool = require('../db');
var router = express.Router();
var db = require('../db')
const {postSchema, idScheme} =require('./posts.scheme')
/*
BD en postgreSQL
*/
mockBD = [
  {id:1,name:"post1", description:"Lorem Ipsum from post1"},
  {id:2,name:"post2", description:"Lorem Ipsum from post2"}
]



//Obtener lista de posts: Deberá retornar todos los posts
router.get('/', function(req, res, next) {
  //const result = JSON.stringify(mockBD)
  const result = db.query(
    'SELECT * FROM posts ORDER BY id ASC',
    (error, result) => {
      if(error) next(error)
      res.type('json').status(200).send(result.rows);
    }
    )

  
});

//Crear posts: Deberá retornar el post creado
router.post('/', function(req, res, next) {
  //mockBD.sort((a,b) => a.id > b.id);
  //console.log(req.body)

  /*const validationResult = postSchema.validate( req.body );
  if(validationResult.error){
    console.log(validationResult)
    next( validationResult.error )
    res.end()
  }*/

  //req.body.id = mockBD.at(-1).id+1;
  //mockBD      = [...mockBD, req.body];
  //const result      = mockBD.at(-1);
  //console.log(req.body.name, req.body.description)
  pool.query(
            'INSERT INTO posts (name, description) VALUES ($1, $2) RETURNING id', [req.body.name, req.body.description],
            ( error, result ) => {
                  if(!!error && !result) next(error)
                  const insertedId = result.rows[0].id;
                  pool.query(
                            'SELECT * FROM posts WHERE id = $1', [ insertedId ],
                            ( error, result ) => {
                                if(error) next(error)
                                res.type('json').status(200).send(result.rows[0]);
                              }
                            )
            }
          )

});

//Eliminar posts: Deberá retornar el post eliminado
router.delete('/:id', function(req, res, next) {
  
  try{
      idScheme.validate( req.params.id );
  }catch(error){
      next(error)
  }
  //const indexDel    = mockBD.map(a => a.id).indexOf( Number(req.params.id) );
  //const objToDelete = JSON.stringify( mockBD[indexDel] )
  //mockBD.splice(indexDel,1);
  pool.query(
    'SELECT * FROM posts WHERE id = $1', [ req.params.id ],
    ( error, result ) => {
        if(error) next(error)
        const entry = result.rows[0]
        pool.query(
          'DELETE FROM posts WHERE id = $1', [ req.params.id ],
          ( error, result ) => {
                if(error) next(error)
                res.type('json').status(200).send(entry);
          }
        )
      }
    )


});



module.exports = router;
