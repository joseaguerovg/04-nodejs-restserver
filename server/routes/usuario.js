const bcrypt = require('bcrypt');
const express = require('express');
const _ = require('underscore');

const Usuario = require('../models/usuario');
const auth = require('../middlewares/auth');

const app = express();

app.get('/usuario', auth.verifyToken, (req, res) => {

    let limite = Number(req.query.limite) || 5;
    let page = Math.max(0, req.query.page);

    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(limite * page)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.countDocuments({ estado: true }, (err, count) => {
                res.json({
                    ok: true,
                    total: count,
                    page: page,
                    numPages: Math.round(count / limite),
                    usuarios,

                });
            })

        });
});

app.post('/usuario', [auth.verifyToken, auth.verifyAdminRole], (req, res) => {

    let { nombre, email, password, role } = req.body;

    let usuario = new Usuario({
        nombre,
        email,
        password: bcrypt.hashSync(password, 10),
        role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });
});

app.put('/usuario/:id', [auth.verifyToken, auth.verifyAdminRole], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })


});

app.delete('/usuario/:id', [auth.verifyToken, auth.verifyAdminRole], (req, res) => {

    let id = req.params.id;
    let cambioEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambioEstado, { new: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })

});

module.exports = app;