const express = require('express');

//para encriptar contraseñas
const bcrypt = require('bcrypt');
//js con esteroides
const _ = require('underscore');

//importamos el modelo
const Usuario = require('../models/usuario');
// se pone con mayúscula por nominglatura, oprque hacemos referencia al objeto 

const app = express();


//routes
app.get('/usuario', function (req, res) {
        
//paŕametros opcionales
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);
            //Usuario.find({},'qué datos queremos sacarle al arreglo, exclusiones'
    Usuario.find({ estado:true }, 'nombre email role estado google img')
        .skip(desde)
        //cuántos registros quieres
        .limit(limite)
        .exec( (err, usuarios) =>{                
            if (err) {
                return res.status(400).json({
                    //return nos ayuuda aqui a no seguir identando con else, si error, nos bota alv
                    ok:false,
                    err
                });
            }
            //para sacar el conteo, podemos pasarle condiciones
            //Usuario.count ({ google:true / condicion } , (err, conteo) =>{
            Usuario.count ({ estado:true } , (err, conteo) =>{                    
                res.json({
                    ok:true,
                    usuarios,
                    cuantos: conteo
                }); 
            });
        })

});
  
app.post('/usuario', function (req, res) {
    let body =  req.body;

    //crea nueva instancia de este esquema con todas las partes de éste, o podemos especificar 
    let usuario =  new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    //aqui guardamos
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                //return nos ayuuda aqui a no seguir identando con else, si error, nos bota alv
                ok:false,
                err
            });
        }
        
        //usuarioDB.password = null; para que no muestre la contraseña, o podemos modificar el esquema
        //sillega aqui es que no disparó el return o sea que no hubo error
        res.json({
            ok:true,
            usuario: usuarioDB
        });
    });
}); 

//actualizacion
app.put('/usuario/:id', function (req, res) {
            //usuario/:parámetro
    let id = req.params.id;
                    //parametro
    let body = _.pick(req.body,['nombre','email','img','role','estado']);

    Usuario.findByIdAndUpdate( id, body, { useFindAndModify:true, new:true, runValidators:true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok:false,
                err
            });
        };
        
        res.json({
            ok:true,
            uaurio:usuarioDB
        });
    });
});
  
app.delete('/usuario/:id', function (req, res) {
    
    let id = req.params.id;
    
    //Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        let cambiaEstado = {
            estado:false
        };
        
        Usuario.findByIdAndUpdate( id, cambiaEstado, { useFindAndModify:true, new:true }, (err, usuarioBorrado) => {
            if (err) {
            return res.status(400).json({
                ok:false,
                err
            });
        };

        if ( !usuarioBorrado){
            return res.status(400).json({
                ok:false,
                err: {
                    message: 'usuario no encontrado'
                }
            });
        }

        res.json({
            ok:true,
            usuario: usuarioBorrado
        });
    });
});
    

//exportamos 
module.exports = app;