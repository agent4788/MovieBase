/**
 * Created by oliver on 07.05.17.
 *
 * Filme Router
 */

var dashboard = require('../controller/dashboard.js');
var movieList = require('../controller/movielist.js');
var detailView = require('../controller/detailview.js');

module.exports = function(app) {

    app.get('/', dashboard);
    app.get('/movies/', movieList);
    app.get('/detailView/:id', detailView);
}