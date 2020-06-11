//primero lee y ehecuta 
require('./config/config')

//extensiones

const express = require('express');
const mongoose = require('mongoose');


const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

//estamos haciendo referencia a las rutas para cuando corremos nodemon server/server
app.use (require('./config/routes/usuario'));

 


//conexión a base de datos
/*aunque la base de datos no exista podemos realizar la conexión.
una vez que ingresemos datos, mogoose y mongodb se van a encargar de montar
toda la estructura
*/

mongoose.connect(process.env.URLDB, 
{useNewUrlParser: true, useUnifiedTopology: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('está conectado');
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