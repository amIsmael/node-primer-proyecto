

const express = require('express');

const app = express();


const Categoria = require('../models/categoria');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
const usuario = require('../models/usuario');

//==================
//buscar productos
//==================

app.get('/producto/:buscar/:termino', verificaToken, (req, res) =>{

    let termino =  req.params.termino;

    //para hacer búsque flexible hacemos una expresión regular
    let regex = new RegExp(termino, 'i');
    /*es una función de javascript, le mandamos qué va a ser la expresión regular
    la , 'i' es para que sea indistinta a mayúsculas y minúculas*/

    Producto.find({ nombre:regex })
    .populate('categoria', 'descripcion')
    .exec((err,productos)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            ok: true,
            productos
        });

    });

});


//==================
//crear nuevo producto
//==================
app.post('/producto', verificaToken, (req, res) => {
    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre:body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });

    producto.save ( (err, productoDB) => {
        //error base de datos en el save
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        
        
        res.status(201).json({
            ok: true,
            producto: productoDB
        });

    });
});

//==================
//modificar un producto mediante ID
//==================

app.put('/producto/:id', [verificaToken, verificaAdmin_Role], function (req, res) {
    let id = req.params.id;
    let body = req.body;

    let descProducto = {
        usuario: req.usuario._id,
        nombre:body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria
    };

    Producto.findByIdAndUpdate(id, descProducto, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'no existe el elemento que deseas modificar.... uñetasXD'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB,
        });

    });

});

//==================
//eliminar un producto mediante ID
//==================

app.delete('/producto/:id', [verificaToken, verificaAdmin_Role], ( req, res ) => {

    let id = req.params.id;

    Producto.findById(id, (err, productoDB) =>{

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'el producto que deseas eliminar no existe'
                }
            });
        }
        productoDB.dispoible = false;

        productoDB.save( (err, productoBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok:true,
                message:'producto eliminado exitosamente',
                producto: productoBorrado
            });
        });

    });

});

//==================
//enlista todos los productos disponibles
//==================
app.get('/producto', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 10;
    limite = Number(limite);


    Producto.find({disponible:true})
    .skip(desde)
    .limit(limite)

    .sort('nombre')

    //populate sirve para revisar qué id / objets existen en categoria solicitada, nos permite cargarles información
    //cargar información de otras tablas
    .populate('usuario', 'nombre email') //('objeto' , 'qué datos'  )
    .populate('categoria', 'descripcion') //('objeto' , 'qué datos'  )
    //revisa qué objets ids existen en el object que estoy solicitando

    .exec((err, productos) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            
            Producto.countDocuments({},(err,conteo) => {
                res.json({
                    ok: true,
                    productos,
                    cuantos: conteo
                });

            })

        });


});

app.get('/producto/:id', verificaToken,(req, res) => {
    let id = req.params.id;
    
    Producto.findById(id) 
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) =>{
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'el producto no existe'
                }
            });
        };

        res.json({
            ok: true,
            producto: productoDB
        });
    });

});


module.exports = app;