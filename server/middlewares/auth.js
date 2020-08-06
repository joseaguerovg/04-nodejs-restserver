const jwt = require('jsonwebtoken');

let verifyToken = (req, res, next) => {

    let token = req.get('Authorization');

    jwt.verify(token, process.env.TOKEN_SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            })
        }

        req.usuario = decoded.usuario;

        next();

    });

};

let adminPermission = (req, res, next) => {
    let token = req.get('Authorization');

    jwt.verify(token, process.env.TOKEN_SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        if (decoded.usuario.role != 'ADMIN_ROLE') {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'No tiene permisos para realizar esta acción'
                }
            });
        }

        req.usuario = decoded.usuario;

        next();

    });
};

module.exports = {
    verifyToken,
    adminPermission
};