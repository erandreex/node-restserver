const express = require('express');

const middlewares = require('../middlewares/autenticacion');

let app = express();

const Producto = require('../models/producto');

const _ = require('underscore');

//=============================================
// Obtener productos
//=============================================

app.get('/productos', middlewares.verificaToken, (req, res) => {
    //traer todos los productos
    //populate: usuario y categoria
    //páginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto
        .find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos
            });

        });

});


//=============================================
// Obtener producto x id
//=============================================

app.get('/productos/:id', (req, res) => {

    let id = req.params.id;

    Producto
        .findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

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
                        message: 'No existe'
                    }
                })
            }

            res.json({
                ok: true,
                producto: productoDB
            });

        });

});

//=============================================
// Buscar productos
//=============================================

app.get('/productos/buscar/:termino', middlewares.verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto
        .find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos: productos
            });


        });

});



//=============================================
// Crear un nuevo producto
//=============================================

app.post('/productos', middlewares.verificaToken, (req, res) => {

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    })

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        res.status(201).json({
            ok: true,
            Producto: productoDB
        });
    });
});


//=============================================
// Actualizar un producto
//=============================================

app.put('/productos/:id', (req, res) => {
    //Actualizar el producto

    let id = req.params.id;

    let body = _.pick(req.body, ['nombre', 'descricpcion', 'precioUni', 'categoria', 'disponible']);

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no encontrado'
                }
            });
        };

        res.json({
            ok: true,
            producto: productoDB
        });

    });


});

//=============================================
// Desactivar un producto
//=============================================

app.delete('/productos/:id', (req, res) => {

    let id = req.params.id;


    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        };

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID de Producto no encontrado'
                }
            })
        }

        productoDB.disponible = false;

        productoDB.save((err, productoBorrado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            };

            res.json({
                ok: true,
                producto: productoBorrado,
                message: 'Producto borrado'
            });

        });



    })
});



module.exports = app;