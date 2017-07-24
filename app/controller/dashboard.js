/**
 * Created by oliver on 07.05.17.
 *
 * Dashboard Controller
 */

const DashboardModel = require('../model/dashboardmodel');
const movieFormat = require('../util/movieFormat');
const config = require('../config');

module.exports = function(req, res) {

    var _dashoardModel = new DashboardModel();
    _dashoardModel.getDasboardData(function(data) {

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // neuste Filme ////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

            if(data.newestMovies[randomId] != undefined) {

                newestMovies[i] = movieFormat(data.newestMovies[randomId]);
                i++;
            }

            //abbrechen wenn alle vorhandennen Filme in der Liste sind
            if(newestMovies.length == data.newestMovies.length) {

                break;
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // beste Filme /////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

            if(data.bestMovies[randomId] != undefined) {

                bestMovies[i] = movieFormat(data.bestMovies[randomId]);
                i++;
            }

            //abbrechen wenn alle vorhandennen Filme in der Liste sind
            if(newestMovies.length == data.bestMovies.length) {

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