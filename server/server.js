//Requires necesarios para la funcionalidad correcta del server
require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
var bodyParser = require('body-parser');



//MiddleWares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Configuracion global de rutas
app.use(require('./routes/index'));



//Conexion a la base de datos
mongoose.connect(process.env.URLDB,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, (err, res) => {
    if (err) throw err;

    console.log(`Base de datos ONLINE`);
});


//Dice en que puerto escucha
app.listen(process.env.PORT, () => {
    console.log("Escuchando puerto: ", process.env.PORT);
})