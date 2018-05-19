module.exports = function(app) {
    app.get('/formulario', function(req, resp) {
        resp.render("home/index");
    });
};