/**
 * Created by oliver on 07.05.17.
 *
 * Filme Router
 */

var dashboard = require('../controller/dashboard');
var newesMovies = require('../controller/newesmovies');
var movieList = require('../controller/movielist');
var movieBoxList = require('../controller/movieboxlist');
var detailView = require('../controller/detailview');
var updateRating = require('../controller/updaterating');
var search = require('../controller/search');
var statistics = require('../controller/statistics');

var maintable = require('../controller/admin/maintable');
var addMovie = require('../controller/admin/addmovie');
var editMovie = require('../controller/admin/editmovie');
var deleteMovie = require('../controller/admin/deletemovie');
var boxtable = require('../controller/admin/boxtable');
var addMovieBox = require('../controller/admin/addmoviebox');
var editMovieBox = require('../controller/admin/editmoviebox');
var deleteMovieBox = require('../controller/admin/deletemoviebox');
var maganeMovieBoxMovies = require('../controller/admin/maganemovieboxmovies');
var addMovieToBox = require('../controller/admin/addmovietobox');
var editMovieInBox = require('../controller/admin/editmovieinbox');
var deleteMovieFromBox = require('../controller/admin/deletemoviefrombox');
var backups = require('../controller/admin/backuplist');
var createBackup = require('../controller/admin/createbackup');
var downloadBackup = require('../controller/admin/downloadbackup');
var deleteBackup = require('../controller/admin/deleteBackup');
var restoreBackup = require('../controller/admin/restorebackup');
var settings = require('../controller/admin/settings');
var deleteCache = require('../controller/admin/deletecache');

module.exports = function(app) {

    app.get('/', dashboard);
    app.get('/new', newesMovies);
    app.get('/movies', movieList);
    app.get('/boxes', movieBoxList);
    app.get('/detailView/:id', detailView);
    app.get('/updateRating/:id/:newRating', updateRating);
    app.get('/search', search);
    app.get('/statistics', statistics);

    app.get('/admin', maintable);
    app.get('/admin/addMovie', addMovie.get);
    app.post('/admin/addMovie', addMovie.post);
    app.get('/admin/editMovie/:id', editMovie.get);
    app.post('/admin/editMovie/:id', editMovie.post);
    app.get('/admin/deleteMovie/:id', deleteMovie);
    app.get('/admin/boxes', boxtable);
    app.get('/admin/addMovieBox', addMovieBox.get);
    app.post('/admin/addMovieBox', addMovieBox.post);
    app.get('/admin/editMovieBox/:id', editMovieBox.get);
    app.post('/admin/editMovieBox/:id', editMovieBox.post);
    app.get('/admin/deleteMovieBox/:id', deleteMovieBox);
    app.get('/admin/manageMovieBoxMovies/:id', maganeMovieBoxMovies);
    app.get('/admin/addMovieToBox/:id', addMovieToBox.get);
    app.post('/admin/addMovieToBox/:id', addMovieToBox.post);
    app.get('/admin/editMovieInBox/:id', editMovieInBox.get);
    app.post('/admin/editMovieInBox/:id', editMovieInBox.post);
    app.get('/admin/deleteMovieFromBox/:id', deleteMovieFromBox);
    app.get('/admin/backups', backups.get);
    app.post('/admin/backups', backups.post);
    app.get('/admin/createBackup', createBackup);
    app.get('/admin/downloadBackup/:file', downloadBackup);
    app.get('/admin/deleteBackup/:file', deleteBackup);
    app.get('/admin/restoreBackup/:file', restoreBackup);
    app.get('/admin/settings', settings.get);
    app.post('/admin/settings', settings.post);
    app.get('/admin/deleteCache', deleteCache);
}