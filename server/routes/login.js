//Requires necesarios para el controlador o rutas de login
const express = require('express');
const app = express();
const Usuario = require('../models/usuario')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioBDD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioBDD) {
            return res.status(400).json({
                ok: false,
                message: '(Usuario) o password incorrecto'
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioBDD.password)) {
            return res.status(400).json({
                ok: false,
                message: 'Usuario o (password) incorrecto'
            });
        }


        let token = jwt.sign({
            usuario: usuarioBDD
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }); // La cantidad dentro del expiresIn esta en minutos

        res.json({
            ok: true,
            usuario: usuarioBDD,
            token
        });



    });


})


//Configuraciones de Google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //Retorna el nombre, email, link de la imagen y estado google desde el API de Google
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
}



app.post('/google', async (req, res) => {
    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            });
        });



    Usuario.findOne({ email: googleUser.email }, (err, usuarioBDD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (usuarioBDD) {
            if (usuarioBDD.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe usar su ingreso normal'
                    }
                });
            } else {
                let token = jwt.sign({
                    usuario: usuarioBDD
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }); // La cantidad dentro del expiresIn esta en minutos

                return res.json({
                    ok: true,
                    usuario: usuarioBDD,
                    token
                });
            }
        } else {
            //Si el usuario no existe en nuestra base de datos
            let usuario = new Usuario();

            //Se llenan los campos del objeto modelo
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            //Se guarda el modelo en la base de datos

            usuario.save((err, usuarioBDD) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                //Se asigna un token y se devuelve el usuario creado con google con su respectivo token
                let token = jwt.sign({
                    usuario: usuarioBDD
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }); // La cantidad dentro del expiresIn esta en minutos

                return res.json({
                    ok: true,
                    usuario: usuarioBDD,
                    token
                });



            });





        }

    });

    // res.json({
    //     usuario: googleUser
    // });
})



module.exports = app;