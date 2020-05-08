require('./config/config')
const express = require('express')
const app = express()
var bodyParser = require('body-parser')


//variables del entorno

//MiddleWars
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



//Peticion get es para recuperar informacion
app.get('/usuario', function (req, res) {
    res.json('getUsuario')
})

//Peticion post es para insertar informacion
//En el post los parametros no se visualizan en la url 
//El req.body recibe los parametros por form-urlencoded y no por la url normal pero toca instanciar los middlewars y el bodyparser
app.post('/usuario', function (req, res) {
    let body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({
            ok:false,
            mensaje: 'El nombre es necesario'
        })
    } else {
        res.json({
            persona: body
        })
    }


})
//Peticion put es para actualizar informacion
//En el put esta recibiendo un parametro con dos puntos para poder actualizar con ese id
app.put('/usuario/:id', function (req, res) {
    let id = req.params.id;
    res.json({
        id
    });
})
//Peticion delete es para borrar informacion
app.delete('/usuario', function (req, res) {
    res.json('deleteUsuario')
})

app.listen(process.env.PORT, () => {
    console.log("Escuchando puerto: ", process.env.PORT);
})