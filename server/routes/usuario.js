const express = require('express');
const bcrypt = require('bcrypt');

const Usuario = require('../models/usuario');

const app = express();

app.get('/usuario', (req, res) => {
    res.json('get Usuarios');
});

app.post('/usuario', (req, res) => {

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
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });
});

app.put('/usuario/:id', (req, res) => {

    let id = req.params.id;

    res.json({
        id
    });
});

app.delete('/usuario', (req, res) => {
    res.json('delete Usuarios');
});

module.exports = app;