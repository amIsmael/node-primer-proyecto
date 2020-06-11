//var const forma global

//onjeto que corre de forma global en node

/*==================
    PUERTO
===================*/
process.env.PORT = process.env.PORT || 3000;

/*==================
    ENTORNO
===================*/
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/*==================
    BASE DE DATOS
===================*/
let urlDataBase = '';

if ( process.env.NODE_ENV === 'dev') {
    urlDataBase = 'mongodb://localhost:27017/cafe'
} else {
    urlDataBase = 'mongodb+srv://cafe-user:KDR7HrAJswPuB8u@cluster0-yhc4c.mongodb.net/cafe?retryWrites=true&w=majority'
}

process.env.URLDB = urlDataBase;