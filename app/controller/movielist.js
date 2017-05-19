/**
 * Created by oliver on 19.05.17.
 *
 * Filme Listen Controller
 */

const MovieModel = require('../model/moviemodel');
const config = require('../config');

module.exports = function(req, res) {

    var movieModel = new MovieModel();
    movieModel.listMovies(function(data) {

        //Daten nach Titel aufsteigend sortieren
        data.sort(function(a, b) {

            if(a.title > b.title) {

                return 1;
            } else if(a.title < b.title) {

                return -1;
            }
            return 0;
        });

        var elementsAtPage = config.pagination.elementsAtPage;
        var elements = data.length;
        var pagination = {

        };


        //Template an Browser
        res.render('list', {data: data});
    });

}