
const mongoose = require('mongoose');


let Schema = mongoose.Schema;

//estamos creando el esquema, le damos forma de tuplas con sus características
//nótese que el usuario regresará un objeto, es quien modificó/creó la tupla
let categoriaSchema = new Schema({
    descripcion: { type: String, unique: true, required: [true, 'La descripción es obligatoria'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    estado: { type: Boolean, required: true, default: true }
});



/*exportamos el modelo, ponemos el nombre que le queremos dar al modelo 'nombre', toda la configuración de usuarioSchema */
module.exports = mongoose.model('Categoria', categoriaSchema);

