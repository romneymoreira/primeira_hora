module.exports = function(app) {
    app.get("/form_add_noticia", function(req, resp) {
        app.app.controllers.admin.form_add_noticia(app, req, resp);
    });

    app.post("/noticias/salvar2", function(req, resp) {
        var noticia = req.body;

        req.assert("titulo", "Titulo deve ser preenchido").notEmpty();
        req.assert("resumo", "Resumo deve ser preenchido").notEmpty();
        req.assert("resumo", "Resumo deve conter entre 10 e 100 caracteres").len(10, 100);
        req.assert("autor", "Autor deve ser preenchido").notEmpty();
        req.assert("data_noticia", "Data deve ser preenchido").notEmpty();

        var erros = req.validationErrors();
        console.log(erros);

        if (erros) {
            resp.render("admin/form_add_noticia", { validacao: erros, noticia: noticia });
            return;
        }

        var connection = app.config.dbConnection();
        var noticiaModel = new app.app.models.NoticiasDAO(connection);

        noticiaModel.salvarNoticia(noticia, function(error, result) {
            resp.redirect("/noticias");
        });
    });
};