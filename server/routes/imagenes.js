

const express = require('express');

const fs = require('fs');
const path = require('path');

const { verificaTokenImg } = require('../middlewares/autenticacion');


let app =  express();


app.get('/imagen/:tipo/:img',verificaTokenImg, (req, res)=>{

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImg = `./uploads/${ tipo }/${ img }`;

    
    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ img }`);

    //vamos a checar si existe la ruta (ruta/../../imagen)
    //si sí existe mostramos la imagen, sino pues mandamos mensaje
    if ( fs.existsSync( pathImagen )){
        res.sendFile(pathImagen);
    }else{
        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
        /*esta función manda un archivo, con la ventaja de que setea la configuración automática 
        para el tipo de archivo
        se manda con un path absoluto*/
        res.sendFile(noImagePath);
    }

});




module.exports = app;