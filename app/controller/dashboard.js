/**
 * Created by oliver on 07.05.17.
 *
 * Dashboard Controller
 */

const DashboardModel = require('../model/dashboardmodel');
const SettingsModel = require('../model/settingsmodel');
const MovieModel = require('../model/moviemodel');
const movieFormat = require('../util/movieFormat');

module.exports = function(req, res) {

    var _dashoardModel = new DashboardModel();
    _dashoardModel.getDasboardData(function(dashboardData) {

        var _movieModel = new MovieModel();
        _movieModel.listMoviesIdIndex(function (movies) {

            var _settingsModel = new SettingsModel();
            _settingsModel.getSettings(function (settings) {

                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // neuste Filme ////////////////////////////////////////////////////////////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                //Liste mit den Filmen erstellen
                var newestMoviesList = [];
                for(var i in dashboardData.newestMovies) {

                    if(movies[dashboardData.newestMovies[i]]) {

                        newestMoviesList[i] = movies[dashboardData.newestMovies[i]];
                    }
                }

                //array "mischen" und die ersten 5 Filme anzeigen
                var newestMovies = [];
                var usedIds = [];
                var i = 0;
                while(newestMovies.length < settings.dashboard.newestMoviesShow) {

                    var randomId = randomNumber(0, 49);
                    if(usedIds.indexOf(randomId) > 0) {

                        //Zufallszahl bereits verwendet
                        continue;
                    }
                    usedIds[randomId] = randomId;

                    if(newestMoviesList[randomId] != undefined) {

                        newestMovies[i] = movieFormat(newestMoviesList[randomId]);
                        i++;
                    }

                    //abbrechen wenn alle vorhandennen Filme in der Liste sind
                    if(newestMovies.length == newestMoviesList.length) {

                        break;
                    }
                }

                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // beste Filme /////////////////////////////////////////////////////////////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                //Liste mit den Filmen erstellen
                var bestMoviesList = [];
                for(var i in dashboardData.bestMovies) {

                    if(movies[dashboardData.bestMovies[i]]) {

                        bestMoviesList[i] = movies[dashboardData.bestMovies[i]];
                    }
                }

                //array "mischen" und die ersten 5 Filme anzeigen
                var bestMovies = [];
                var usedIds = [];
                var i = 0;
                while(bestMovies.length < settings.dashboard.bestMoviesShow) {

                    var randomId = randomNumber(0, 49);
                    if(usedIds.indexOf(randomId) > 0) {

                        //Zufallszahl bereits verwendet
                        continue;
                    }
                    usedIds[randomId] = randomId;

                    if(bestMoviesList[randomId] != undefined) {

                        bestMovies[i] = movieFormat(bestMoviesList[randomId]);
                        i++;
                    }

                    //abbrechen wenn alle vorhandennen Filme in der Liste sind
                    if(newestMovies.length == bestMoviesList.length) {

                        break;
                    }
                }

                //Seite an Browser senden
                res.render('dashboard', {newestMovies: newestMovies, bestMovies: bestMovies});
            });
        });
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