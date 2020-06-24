

const express = require('express');
//para encriptar
const bcrypt = require('bcrypt');
//para matchear las contraseñas
const jwt =require('jsonwebtoken');

//AUTENTICADOR DE TOKENS GOOGLE
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


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


/* NOTA PARA LOS TOKENS
After you receive the ID token by HTTPS POST, you must verify the integrity of the token. To verify that the token is valid, ensure that the following criteria are satisfied:

    The ID token is properly signed by Google. Use Google's public keys (available in JWK or PEM format) to verify the token's signature. These keys are regularly rotated; examine the Cache-Control header in the response to determine when you should retrieve them again.
    The value of aud in the ID token is equal to one of your app's client IDs. This check is necessary to prevent ID tokens issued to a malicious app being used to access data about the same user on your app's backend server.
    The value of iss in the ID token is equal to accounts.google.com or https://accounts.google.com.
    The expiry time (exp) of the ID token has not passed.
    If you want to restrict access to only members of your G Suite domain, verify that the ID token has an hd claim that matches your G Suite domain name.

Rather than writing your own code to perform these verification steps, we strongly recommend using a Google API client library for your platform, or a general-purpose JWT library. For development and debugging, you can call our tokeninfo validation endpoint. */


//Configuración de Google

async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //este es el objeto retornado por token válido
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google:true
    }
}

//cuando se postea en google 
app.post('/google', async (req, res) => {
    // 1 primero obtenemos el token
    let token = req.body.idtoken;
    
    //con el token mandamos la función de verify
    let googleUser = await verify( token )
            .catch(e => {
                //error ps token invalido
                return res.status(403).json({
                    err: e,
                    ok:false
                });
                //si no hay error, retornamos el objeto que creamos en verify
            });
            
            //llamamos al esquema usuario para verificar que en la base de datos no tengamos el correo ingresado
            Usuario.findOne( {email: googleUser.email}, (err, usuarioDB) =>{
                if(err) {
                    return res.status(500).json({
                        ok:false,
                        err
                    });
                }

                //si obtenemos un usuario (objeto) de base de datos, validamos la información
                if ( usuarioDB ) {
                    
                    //si existe el usuario.(email), es porque el usuario hizo su registro manualmente, 
                    if ( usuarioDB.google === false ) {
                        return res.status(400).json({
                            ok:false,
                            err: {
                                message: 'Debe de usar su autenticación normal'
                            }
                        });
                    }else {
                    /*si el usuario se autenticó con google se renueva el token y lo regreso*/
                        let token = jwt.sign({
                            usuario: usuarioDB
                        }, process.env.SEED,{ expiresIn: process.env.CADUCIDAD_TOKEN});

                        return res.json({
                            ok:true,
                            usuario: usuarioDB,
                            token
                        });
                    }

                } else {
                /*si el usuario no existe en la base de datos lo creamos, guradamos  y retornamos token 
                podemos primero definir el esquema y pasar las propiedades aparte(como abajo)
                o bien, meter todo de un chingazo 
                let usuario = new Usiario({usuario.nombre = googleUser.nombre;
                    usuario.email = googleUser.email;});
                algo así como arriba
                */
                    let usuario = new Usuario();

                    usuario.nombre = googleUser.nombre;
                    usuario.email = googleUser.email;
                    usuario.img = googleUser.img;
                    usuario.google = true;
                    usuario.password = ': )';

                    usuario.save ((err, usuarioDB) =>{
                        if(err) {
                            return res.status(500).json({
                                ok:false,
                                err
                            });
                            
                        };

                        let token = jwt.sign({
                            usuario: usuarioDB
                        }, process.env.SEED,{ expiresIn: process.env.CADUCIDAD_TOKEN});

                        return res.json({
                            ok:true,
                            usuario: usuarioDB,
                            token
                        });


                    });

                }
                

            });


});




module.exports = app;