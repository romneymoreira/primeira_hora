module.exports.form_add_noticia = function(app, req, resp) {
    resp.render("admin/form_add_noticia", { validacao: {}, noticia: {} });
};

module.exports.noticias_salvar = function() {

};