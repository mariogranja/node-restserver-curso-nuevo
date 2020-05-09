//Requires necesarios para el uso de rutas o controladores
const express = require('express');
const app = express();
const Usuario = require('../models/usuario')
const bcrypt = require('bcrypt');
const _ = require('underscore');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

//Peticion get es para recuperar informacion
app.get('/usuario', verificaToken,function (req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre estado google id role')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarioBDD) => {
            //Muestra el error que regrese el callback por un json
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            //Codigo para contar los registros que devuelve el GET
            Usuario.countDocuments({ estado: true }, (err, conteo) => {
                if (err) {
                    return res.status(404).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    usuarioBDD,
                    conteo
                })
            })


        })
})

//Peticion post es para insertar informacion
//En el post los parametros no se visualizan en la url 
//El req.body recibe los parametros por form-urlencoded y no por la url normal pero toca instanciar los middlewares y el bodyparser
app.post('/usuario', [verificaToken, verificaAdminRole],function (req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    usuario.save((err, usuarioBDD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // usuarioBDD.password = null;

        res.json({
            ok: true,
            usuario: usuarioBDD
        });
    });


});
//Peticion put es para actualizar informacion
//En el put esta recibiendo un parametro con dos puntos para poder actualizar con ese id
app.put('/usuario/:id', [verificaToken, verificaAdminRole],function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    //Se coloca el new:true para que el callback retorne el usuario actualizado y no el usuario antes de actualizar
    //Se coloca el runValidators para que tome en cuenta las validaciones de los campos del modelo el momento de actualizar
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioBDD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBDD
        });

    })

    // res.json({
    //     id
    // });
})
//Peticion delete es para borrar informacion
app.delete('/usuario/:id', [verificaToken, verificaAdminRole],function (req, res) {
    let id = req.params.id;

    let body = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    })

})

module.exports = app;