const jwt = require('jsonwebtoken');



//==========================
// Verificar token
//==========================

//middleware
let verificaToken = ( req, res, next ) => {

    //recibo token req.get('qué parte del req')
    let token = req.get('token');
    
    //vamos a validaar el rtoken
    jwt.verify( token, process.env.SEED, (err,decoded) =>{
        //si falla 
        if( err ){
            return res.status(401).json({
                ok:false,
                err: {
                    message: 'token no válido'
                }
            });
        }
        //si no falla
        req.usuario = decoded.usuario;

        //ponemos aqui el next para validar que el token haya sido válido, ojo con validaciones
        next();
        
    });
};



//==========================
// Verificar AdminRole
//==========================
let verificaAdmin_Role = ( req, res, next ) => {

    //usuario es el mismo que me manden por req
    let usuario = req.usuario;
    
    
    //si falla 
    if( usuario.role !== 'ADMIN_ROLE' ){
        return res.status(401).json({
            ok:false,
            err: {
                message: 'NO CUENTA CON PERMISOS PARA REALIZAR OPERACIÓN, consulte a su administrador : )'
            }
        });
    }
    next();
    //ponemos aqui el next para validar que el token haya sido válido, ojo con validaciones   
};


//==========================
// Verifica Token en imagen
//==========================
let verificaTokenImg = ( req, res, next ) => {
    //obtener token de url
    let token =  req.query.token;
            //req.query.NOMBRE COMO VIENE EN URL

    //vamos a validaar el rtoken
    jwt.verify( token, process.env.SEED, (err,decoded) =>{
        //si falla token
        if( err ){
            return res.status(401).json({
                ok:false,
                err: {
                    message: 'token no válido'
                }
            });
        }
        //si no falla
        //coloca dentro del req y se pueden utilizar las propiedades del usuario en la ruta de imágenes
        req.usuario = decoded.usuario;

        //ponemos aqui el next para validar que el token haya sido válido, ojo con validaciones
        next();
        
    });



}


module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg
};