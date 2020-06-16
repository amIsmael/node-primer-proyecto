

const express = require('express');
//para encriptar
const bcrypt = require('bcrypt');
//para matchear las contraseñas
const jwt =require('jsonwebtoken');

const Usuario = require('../models/usuario');
const usuario = require('../models/usuario');


const app = express();


app.post('/login', (req, res) =>{

    let body = req.body;

    Usuario.findOne({ email:body.email }, (err, usuarioDB) => {
        //si no trae correo
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //si no está el mail en DB 
        if ( !usuarioDB ){
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }

        //validar contraseña
        //si hace match true, sino son iguales ps alv return
        if( !bcrypt.compareSync( body.password, usuarioDB.password )) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });
        }
        
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED,{ expiresIn: process.env.CADUCIDAD_TOKEN});

        res.json({
            ok:true,
            usuario: usuarioDB,
            token
        });
        
    });
});



module.exports = app;