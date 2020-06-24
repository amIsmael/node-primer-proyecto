require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
//path sirve para mandar por segmentos del path y el metodo los arma 

const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//habilitamos la carpeta public
//manda segmentos del path y los arma por nosotros
app.use(express.static(path.resolve(__dirname, '../public')));

// Configuración global de rutas
app.use(require('./routes/index'));


mongoose.connect(process.env.URLDB, 
    {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true});
    
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error: no se pudo conectar con base de datos'));
    db.once('open', function() {
        console.log('está conectado');
    });
    
app.listen(process.env.PORT, () =>{
    console.log("escuchando puerto:", process.env.PORT);
});