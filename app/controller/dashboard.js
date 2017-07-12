/**
 * Created by oliver on 07.05.17.
 *
 * Dashboard Controller
 */

const MovieModel = require('../model/moviemodel');
const movieFormat = require('../util/movieFormat');
const config = require('../config');
const moment = require('moment');
const shuffle = require('shuffle-array');

module.exports = function(req, res) {

    var movieModel = new MovieModel();
    movieModel.listMovies(function(data) {

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // neuste Filme ////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        //Daten nach Datum sortieren
        data.sort(function(obj1, obj2) {

            if(moment(obj1.registredDate).isBefore(obj2.registredDate)) {

                return 1;
            } else if(moment(obj1.registredDate).isSame(obj2.registredDate)) {

                return 0;
            } else if(moment(obj1.registredDate).isAfter(obj2.registredDate)) {

                return -1;
            }
        });

        //die ersten x Elemente in ein eigenes Array kopieren
        var dateFiltered = [];
        for(var i = 0; i < config.dashboard.newestMoviesValue; i++) {

            if(data[i] != undefined) {

                dateFiltered[i] = data[i];
            } else {

                break;
            }
        }

        //array "mischen" und die ersten 5 Filme anzeigen
        var newestMovies = [];
        shuffle(dateFiltered);
        for(var i = 0; i < config.dashboard.newestMoviesShow; i++) {

            if(dateFiltered[i] != undefined) {

                newestMovies[i] = movieFormat(dateFiltered[i]);
            } else {

                break;
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // neuste Filme ////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        //Daten nach Bewertung sortieren
        data.sort(function(obj1, obj2) {

            if(obj1.rating < obj2.rating) {

                return 1;
            } else if(obj1.rating == obj2.rating) {

                return 0;
            } else if(obj1.rating > obj2.rating) {

                return -1;
            }
        });

        //die ersten x Elemente in ein eigenes Array kopieren
        var ratingFiltered = [];
        for(var i = 0; i < config.dashboard.bestMoviesValue; i++) {

            if(data[i] != undefined) {

                ratingFiltered[i] = data[i];
            } else {

                break;
            }
        }

        //array "mischen" und die ersten 5 Filme anzeigen
        var bestMovies = [];
        shuffle(ratingFiltered);
        for(var i = 0; i < config.dashboard.bestMoviesShow; i++) {

            if(ratingFiltered[i] != undefined) {

                bestMovies[i] = movieFormat(ratingFiltered[i]);
            } else {

                break;
            }
        }

        //Seite an Browser senden
        res.render('dashboard', {newestMovies: newestMovies, bestMovies: bestMovies});
    });
}