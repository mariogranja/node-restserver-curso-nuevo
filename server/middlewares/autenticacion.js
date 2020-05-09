//Archivo de middlewares a ser ejecutados en la autenticacion 
//Requires necesarios para las validaciones en ls middlewares
const jwt = require('jsonwebtoken');


//Verificacion de TOKEN

let verificaToken = (req, res, next) => {
    //Obtiene el token desde el header enviado en la peticion por postman
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, tokenDecodificado) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Invalid token'
                }
            });
        }

        req.usuario = tokenDecodificado.usuario;
        //next() sirve para que continue la seccion de codigo de donde llamamos el middleware
        next();

    })
}

//Verifica ADMIN_ROLE

let verificaAdminRole = (req, res, next) => {
    //Puedo usar el req.usuario porque lo estoy seteando en el middleware anterior (verificaToken)
    let usuario = req.usuario;

    //El usuario que estamos verificando es el usuario que esta logueado o autenticado
    //No es el usuario que se esta creando o actualizando desde el controlador o las rutas
    if(usuario.role !== 'ADMIN_ROLE'){
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Usted no tiene privilegios de Administrador' 
            }
        });
    }
    //next() para que continue el programa despues de hacer las validaciones anteriores.
    next();


}


module.exports = {
    verificaToken,
    verificaAdminRole
}