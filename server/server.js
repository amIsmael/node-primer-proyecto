//primero lee y ehecuta 
require('./config/config')

//extensiones

const express = require('express');
const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());


//routes
 
app.get('/usuario', function (req, res) {
  res.json('get usuario');
});

app.post('/usuario', function (req, res) {
    let body =  req.body;
    res.json({
        persona:body
    });
});
  
app.put('/usuario/:id', function (req, res) {
            //usuario/:parámetro
    let id = req.params.id;
                    //parametro
    res.json({
        id
    });
});

app.delete('/usuario', function (req, res) {
    res.json('delete usuario');
});
 
app.listen(process.env.PORT, () =>{
    console.log("escuchando puerto:", process.env.PORT);
});


/*
APP.GET
APP.POST CREAR NUEBOS REGISTROS P.EJ.
APP.PUT SIRVE PARA ACTUALIZAR LOS DATOS


GENERALMENTE NO SE BORRAN LOS DATOS, LOS CAMBIAMOS 
DE UN ESTADO A OTRO ACTIVO/INACTIVO 
PARA TENER PERSISTENCIA DE DATOS

*/