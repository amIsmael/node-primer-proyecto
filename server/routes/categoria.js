

const express = require('express');

const app = express();

const Categoria = require('../models/categoria');

    //destructuración
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;

    let categoria = new Categoria({
        descripcion:body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save ( (err, categoriaDB) => {
        //error base de datos en el save
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        //si no se creó
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
    
        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
});



app.put('/categoria/:id', [verificaToken, verificaAdmin_Role], function (req, res) {
    let id = req.params.id;
    
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'la categoría que quieres eliminar no existe'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], ( req, res ) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove( id, (err, categoriaDB) =>{

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'la categoría no existe'
                }
            });
        }

        res.json({
            ok:true,
            message:'categoría borrada exitosamente'
        });
    });

});

app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})

    .sort('descripcion')

    //populate sirve para revisar qué id / objets existen en categoria solicitada, nos permite cargarles información
    //cargar información de otras tablas
    .populate('usuario', 'nombre email') //('objeto' , 'qué datos'  )
    //revisa qué objets ids existen en el object que estoy solicitando

    .exec((err, categorias) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            
            res.json({
                ok: true,
                categorias
            });


        });


});

app.get('/categoria/:id', verificaToken, function (req, res){
    let id = req.params.id;
    
    Categoria.findById(id, (err, categoriaDB) =>{
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'la categoría no existe'
                }
            });
        };

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});


module.exports = app;