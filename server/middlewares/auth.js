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

let verifyAdminRole = (req, res, next) => {
    let role = req.usuario.role;

    if (role != 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'No tiene permisos para realizar esta acción'
            }
        });
    }

    next();

};

module.exports = {
    verifyToken,
    verifyAdminRole
};