const express = require('express');
const { verifyToken } = require('../middlewares/auth');

let app = express();
let Producto = require('../models/producto');

// Obtener productos
app.get('/productos', (req, res) => {
    // populate: categoria, usuario
    // paginado
});

app.get('/productos/:id', (req, res) => {

});

app.post('/productos', verifyToken, (req, res) => {
    let { nombre, precioUni, descripcion, disponible, categoria, usuario } = req.body;
    let usuario_id = req.usuario._id;

    let producto = new Producto({
        nombre,
        precioUni,
        descripcion,
        disponible,
        categoria,
        usuario: usuario_id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    });

});

// Editar
app.put('/productos/:id', (req, res) => {

});

app.delete('/productos/:id', (req, res) => {

});

module.exports = app;