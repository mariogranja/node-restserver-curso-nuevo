//Requires necesarios para crear el modelo de base de datos
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//Variables necesarias para validar
let rolesValidos = {
    values: ['ADMIN_ROLE','USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}


//Se instancia el schema de mongoose para poder crear los modelos de base de datos
let Schema = mongoose.Schema;


//Se crea el schema o modelo de usuario
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, `El nombre es necesario`]
    },
    email :{
        type: String,
        unique: true,
        required: [true, `El email es necesario`]
    },
    password :{
        type: String,
        required: [true, `El password es necesario`]
    },
    img : {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: `USER_ROLE`,   
        enum: rolesValidos    
    },
    estado:{
        type: Boolean,
        default: true
    },
    google:{
        type: Boolean,
        default: false
    }
});

//Codigo para ocultar que no devuelva el password despues de una peticion en las rutas o controladores
usuarioSchema.methods.toJSON = function(){
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

//Uso de plugin para mostrar correctamente los mensajes de error de valores unicos
usuarioSchema.plugin(uniqueValidator,{message: '{PATH} debe ser unico'})
//Manera correcta de exportar el modelo 'Usuario'
module.exports = mongoose.model('Usuario', usuarioSchema);