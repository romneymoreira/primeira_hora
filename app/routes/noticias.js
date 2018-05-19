var busboy2 = require('busboy');
var fs = require('fs');
var path = require('path');
var dateFormat = require('dateformat');
module.exports = function(app) {
    app.get("/noticias", function(req, resp) {
        var connection = app.config.dbConnection();
        var noticiasModel = new app.app.models.NoticiasDAO(connection);

        noticiasModel.getNoticias(function(error, result) {
            resp.render("noticias/listar_noticias", { noticias: result });
        });
    });

    app.post("/noticias/cadastrar", function(req, resp) {
        var noticia = req.body;
        req.assert("idCategoria", "Categoria deve ser preenchido").notEmpty();
        req.assert("corpo", "Noticia deve ser preenchido").notEmpty();
        var erros = req.validationErrors();
        if (erros) {
            resp.render("noticias/cadastrar", { validacao: erros, noticia: noticia });
            return;
        }

        var connection = app.config.dbConnection();
        var noticiaModel = new app.app.models.NoticiasDAO(connection);
        if (parseInt(noticia.Id) > 0) {
            noticiaModel.editarNoticia(noticia, function(error, result) {
                resp.redirect("/noticias");
            });
        } else {
            noticiaModel.salvarNoticia(noticia, function(error, result) {
                resp.redirect("/noticias");
            });
        }

    });

    app.post('/upload', function(req, res) {
        var now = new Date();
        var busboy = new busboy2({ headers: req.headers });
        busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
            var dir = './app/uploads/' + dateFormat(now, "dd-mm-yyyy");;
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            var saveTo = path.join(dir, filename);
            console.log('Uploading: ' + saveTo);
            file.pipe(fs.createWriteStream(saveTo));
        });
        busboy.on('finish', function() {
            console.log('Upload complete');
            res.writeHead(200, { 'Connection': 'close' });
            res.end("That's all folks!");
        });
        console.log(req.pipe(busboy));
        return req.pipe(busboy);
    });

    app.get("/noticia", function(req, resp) {
        var parametros = req.query;
        var connection = app.config.dbConnection();
        var noticiaModel = new app.app.models.NoticiasDAO(connection);

        var categorias = [];
        var autores = [];

        if (parametros.id > 0) {
            noticiaModel.getCategorias(function(error, result) {
                categorias = result;
                noticiaModel.getAutores(function(error, result) {
                    autores = result;
                    noticiaModel.getNoticia(parametros, function(error, result2) {
                        resp.render("noticias/cadastrar_noticia", { noticia: result2, categorias: categorias, autores: autores, validacao: null });
                    });
                });
            });

        } else {
            var model = [{
                Id: 0,
                Titulo: '',
                IdCategoria: 0,
                IdAutor: 0
            }];
            noticiaModel.getCategorias(function(error, result) {
                categorias = result;
                noticiaModel.getAutores(function(error, result) {
                    autores = result;
                    resp.render("noticias/cadastrar_noticia", { noticia: model, categorias: categorias, autores: autores, validacao: null });
                });
            });

        }


    });
};