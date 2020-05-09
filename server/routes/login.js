//Requires necesarios para el controlador o rutas de login
const express = require('express');
const app = express();
const Usuario = require('../models/usuario')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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





module.exports = app;