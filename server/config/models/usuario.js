
const mongoose = require('mongoose');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
};

let Schema = mongoose.Schema;

//estmaos creando el esquema, le damos forma a la colección poniendo el identificador de tuplas
let usuarioSchema =  new Schema({
    nombre: {
        type: String,
        required:[true, 'el nombre es necesario']
    },
    email: {
        type: String,
        createIndexes: true,
        required:[true, 'el correo es necesario']
    },
    password: {
        type: String,
        required:[true, 'la contraseña es necesaria']
    },
    img: {
        type: String,   
        required:false
    },
    role: {
        type:String,
        default:'USER_ROLE',
        enum: rolesValidos

    },
    estado: {
        type: Boolean,
        default:true    //pa cuando creemos usuario, salga como usuario activo, nomas como nota
    },
    google: {
        type:Boolean,
        default: false  //si el usuario no se registra con google, siempre será falso este bisne
    }
});

/* ya modificamos cuando se imprima mediante un tojson el userSchema */
usuarioSchema.methods.toJSON = function(){
    
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
};
/*exportamos el modelo, ponemos el nombre que le queremos dar al modelo 'nombre', toda la configuración de usuarioSchema */
module.exports = mongoose.model('Usuario', usuarioSchema);

