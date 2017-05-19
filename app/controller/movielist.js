/**
 * Created by oliver on 19.05.17.
 *
 * Filme Listen Controller
 */

const MovieModel = require('../model/moviemodel');

module.exports = function(req, res) {

    var movieModel = new MovieModel();
    res.render('list');
}