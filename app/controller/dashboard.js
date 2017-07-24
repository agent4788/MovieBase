/**
 * Created by oliver on 07.05.17.
 *
 * Dashboard Controller
 */

const MovieModel = require('../model/moviemodel');
const movieFormat = require('../util/movieFormat');
const config = require('../config');
const moment = require('moment');

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
        var usedIds = [];
        var i = 0;
        while(newestMovies.length < 5) {

            var randomId = randomNumber(0, 49);
            if(usedIds.indexOf(randomId) > 0) {

                //Zufallszahl bereits verwendet
                continue;
            }
            usedIds[randomId] = randomId;

            if(dateFiltered[randomId] != undefined) {

                newestMovies[i] = movieFormat(dateFiltered[randomId]);
                i++;
            }

            //abbrechen wenn alle vorhandennen Filme in der Liste sind
            if(newestMovies.length == dateFiltered.length) {

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
        var usedIds = [];
        var i = 0;
        while(bestMovies.length < 5) {

            var randomId = randomNumber(0, 49);
            if(usedIds.indexOf(randomId) > 0) {

                //Zufallszahl bereits verwendet
                continue;
            }
            usedIds[randomId] = randomId;

            if(ratingFiltered[randomId] != undefined) {

                bestMovies[i] = movieFormat(ratingFiltered[randomId]);
                i++;
            }

            //abbrechen wenn alle vorhandennen Filme in der Liste sind
            if(newestMovies.length == ratingFiltered.length) {

                break;
            }
        }

        //Seite an Browser senden
        res.render('dashboard', {newestMovies: newestMovies, bestMovies: bestMovies});
    });
};

/**
 * gibt eine Zufallszahl zwischen min und max zurück
 *
 * @param min Minimalwert
 * @param max Maximalwert
 * @return Zufallszahl
 */
function randomNumber(min, max) {

    return Math.ceil((Math.random() * (max - min)) + min);
}