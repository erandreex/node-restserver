const jwt = require('jsonwebtoken');

//============================
//Verificar Token
//============================

let verificaToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decode) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }

        req.usuario = decode.usuario;
        next();
    });
};

//============================
//Verificar ADMINROLE
//============================


let verificaAdmin_role = (req, res, next) => {


    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decode) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        };

        let usuario = req.usuario;

        if (usuario.role === 'ADMIN_ROLE') {
            next();
        } else {
            return res.json({
                ok: false,
                err: {
                    message: "No tiene permiso para hacer esto"
                }
            })
        };


    });
};

module.exports = {
    verificaToken,
    verificaAdmin_role

}