const express = require('express');

let app = express();

let auth = require('../middlewares/auth');
let Categoria = require('../models/categoria');

app.get('/categoria', auth.verifyToken, (req, res) => {

    Categoria.find()
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                categorias
            });

        });

});

app.get('/categoria/:id', auth.verifyToken, (req, res) => {

});

app.post('/categoria', auth.verifyToken, (req, res) => {
    let nombre = req.body.nombre;
    let usuario_id = req.usuario._id;

    let nuevaCategoria = new Categoria({
        nombre,
        usuario: usuario_id
    });

    nuevaCategoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

app.put('/categoria/:id', auth.verifyToken, (req, res) => {

});

app.delete('/categoria/:id', [auth.verifyToken, auth.verifyAdminRole], (req, res) => {

});

module.exports = app;