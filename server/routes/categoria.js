const express = require('express');

let middlewares = require('../middlewares/autenticacion');
const categoria = require('../models/categoria');

let app = express();

let Categoria = require('../models/categoria');

//============================
//Mostrar todas las categorías
//

app.get('/categoria', middlewares.verificaToken, (req, res) => {

    categoria
        .find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                return console.log(err);
            }

            res.json({
                ok: true,
                categorias
            });

        });

});

//============================
//Mostrar una categoria por ID
//=============================

app.get('/categoria/:id', middlewares.verificaToken, (req, res) => {
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe esa categoria'
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });


});

//============================
//Crear nueva categoría
//================================================================================================

app.post('/categoria', middlewares.verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    })

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    });
});


//============================
//Crear nueva categoría
//=============================

app.put('/categoria/:id', (req, res) => {

    let id = req.params.id;

    let body = req.body;

    let datoscategoria = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate(id, datoscategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    })

});

//============================
//Crear nueva categoría
//=============================

app.delete('/categoria/:id', [middlewares.verificaToken, middlewares.verificaAdmin_role], (req, res) => {

    let id = req.params.id;

    Categoria.findOneAndDelete(id, (err, categoriaBorrada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaBorrada,
            message: 'Categoria borrada'
        });



    });

});

module.exports = app;