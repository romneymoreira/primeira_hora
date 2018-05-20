function NoticiasDAO(connection) {
    this._connection = connection;
}
NoticiasDAO.prototype.getNoticia = function(parametros, vizualizacoes, callback) {
    var Quantidade = parseInt(vizualizacoes[0].Quantidade) + 1;
    var IdNoticia = parseInt(parametros.id);

    this._connection.query('update visualizacoes set Quantidade = ? where IdNoticia = ?', [Quantidade, IdNoticia]);
    this._connection.query("select Id, IdCategoria, Titulo, TRIM(Corpo) as Corpo, IdAutor, Data, Status from noticia where Id = ?", [IdNoticia], callback);
};

NoticiasDAO.prototype.getNoticiaPublicacao = function(parametros, callback) {
    var IdNoticia = parseInt(parametros.id);
    this._connection.query("select Id, IdCategoria, Titulo, TRIM(Corpo) as Corpo, IdAutor, Data, Status from noticia where Status = 'A' and Id = ?", [IdNoticia], callback);
};

NoticiasDAO.prototype.getVizualizacoes = function(parametros, callback) {
    var IdNoticia = parseInt(parametros.id);
    this._connection.query('select Quantidade from visualizacoes where IdNoticia = ?', [IdNoticia], callback);
};

NoticiasDAO.prototype.getCategorias = function(callback) {
    this._connection.query("select * from categoria where Status = 'A' ORDER BY Descricao", callback);
};

NoticiasDAO.prototype.getAutores = function(callback) {
    this._connection.query("select * from autor ORDER BY Nome", callback);
};

NoticiasDAO.prototype.autorizarPublicacao = function(parametros, callback) {
    var IdNoticia = parseInt(parametros.id);
    var visualizacoes = { IdNoticia: IdNoticia, Quantidade: 0 };
    this._connection.query('insert into visualizacoes set ? ', visualizacoes);
    this._connection.query("UPDATE noticia SET Status = 'P' WHERE Id = ?", [IdNoticia], callback);
};

NoticiasDAO.prototype.search = function(parametros, callback) {
    var like = ['%' + parametros.search.toLowerCase() + '%'];
    this._connection.query("select Id, IdCategoria, Titulo, fn_RemoveHTMLTag(Corpo) as Corpo, IdAutor, Data, Status " +
        " from noticia where Status = 'A' and (LOWER(Titulo) like ? or LOWER(fn_RemoveHTMLTag(Corpo)) like ? ) ", [like, like], callback);
};

NoticiasDAO.prototype.getNoticias = function(callback) {
    this._connection.query("select C.Descricao as categoria, N.Titulo as titulo, A.Nome as autor, N.`Status` as status, N.Id as id, N.`Data` as datanoticia " +
        " from noticia N, categoria C, autor A " +
        " where N.IdCategoria = C.Id " +
        " and N.IdAutor = A.Id " +
        " order by N.`Data` desc", callback);
};

NoticiasDAO.prototype.salvarNoticia = function(noticia, callback) {
    this._connection.query('insert into noticia set ? ', noticia, callback);
};

NoticiasDAO.prototype.editarNoticia = function(noticia, callback) {
    this._connection.query('UPDATE noticia SET ? WHERE ?', [noticia, { Id: noticia.Id }], callback);
    console.log(noticia);
};


module.exports = function() {
    return NoticiasDAO;
};