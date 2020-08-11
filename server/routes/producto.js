const express = require('express');
const { verifyToken } = require('../middlewares/auth');

let app = express();
let Producto = require('../models/producto');

// Obtener productos
app.get('/productos', (req, res) => {
    // populate: categoria, usuario
    // paginado

    let limite = Number(req.query.limite) || 5;
    let page = Math.max(0, req.query.page) || 0;

    Producto.find({ disponible: true })
        .skip(limite * page)
        .limit(limite)
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombre email')
        .exec((err, productosDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments({ disponible: true }, (err, count) => {
                res.json({
                    ok: true,
                    total: count,
                    page: page,
                    numPages: Math.round(count / limite),
                    productos: productosDB
                });
            });

        });

});

app.get('/productos/:id', (req, res) => {
    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
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

    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err, productoSave) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoSave
            });
        });

    });

});

app.delete('/productos/:id', (req, res) => {
    let id = req.params.id;
    let disponible = { disponible: false };

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }

        Producto.findByIdAndUpdate(id, disponible, { new: true }, (err, productoDB) => {
            if (err) {
                return res.status(500).json({
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
});

module.exports = app;