
const express = require('express');


const app = express();

// configuración global de rutas
app.use(require('./usuario'));
app.use(require('./login'));









module.exports = app;