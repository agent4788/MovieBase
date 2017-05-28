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

module.exports = function(app) {

    app.get('/', dashboard);
    app.get('/movies', movieList);
    app.get('/boxes', movieBoxList);
    app.get('/detailView/:id', detailView);
    app.get('/search', search);
}