module.exports = function(app) {
    app.get("/news", function(req, resp) {
        var parametros = req.query;
        var connection = app.config.dbConnection();
        var noticiasModel = new app.app.models.NoticiasDAO(connection);
        noticiasModel.getVizualizacoes(parametros, function(error2, result2) {
            noticiasModel.getNoticia(parametros, result2, function(error, result) {
                resp.render("news/news", { noticia: result });
            });
        });
    });

    app.get("/publish", function(req, resp) {
        var parametros = req.query;
        var connection = app.config.dbConnection();
        var noticiasModel = new app.app.models.NoticiasDAO(connection);
        noticiasModel.getNoticiaPublicacao(parametros, function(error, result) {
            resp.render("news/publish", { noticia: result });
        });
    });

    app.get("/autorizar", function(req, resp) {
        var parametros = req.query;
        var connection = app.config.dbConnection();
        var noticiasModel = new app.app.models.NoticiasDAO(connection);
        noticiasModel.autorizarPublicacao(parametros, function(error, result) {
            resp.render("home/index");
        });
    });

    app.post("/search", function(req, resp) {
        var parametros = req.body;
        console.log(parametros);
        var connection = app.config.dbConnection();
        var noticiasModel = new app.app.models.NoticiasDAO(connection);
        noticiasModel.search(parametros, function(error, result) {
            resp.render("news/search", { noticias: result, busca: parametros });
        });
    });



};