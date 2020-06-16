
const express = require('express');


const app = express();

// configuración global de rutas
app.use(require('./routes/index'));











module.exports = app;