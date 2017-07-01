/**
 * Created by oliver on 07.05.17.
 *
 * Filme Router
 */

var dashboard = require('../controller/dashboard');
var movieList = require('../controller/movielist');
var movieBoxList = require('../controller/movieboxlist');
var detailView = require('../controller/detailview');
var search = require('../controller/search');

var maintable = require('../controller/admin/maintable');
var addMovie = require('../controller/admin/addmovie');
var editMovie = require('../controller/admin/editmovie');
var deleteMovie = require('../controller/admin/deletemovie');

module.exports = function(app) {

    app.get('/', dashboard);
    app.get('/movies', movieList);
    app.get('/boxes', movieBoxList);
    app.get('/detailView/:id', detailView);
    app.get('/search', search);

    app.get('/admin', maintable);
    app.get('/admin/addMovie', addMovie.get);
    app.post('/admin/addMovie', addMovie.post);
    app.get('/admin/editMovie/:id', editMovie.get);
    app.post('/admin/editMovie/:id', editMovie.post);
    app.get('/admin/deleteMovie/:id', deleteMovie);
}