/**
 * Created by oliver on 29.07.17.
 *
 * Neuste Filme Controller
 */

const DashboardModel = require('../model/dashboardmodel');
const MovieModel = require('../model/moviemodel');
const movieFormat = require('../util/movieFormat');

module.exports = function(req, res) {

    var _dashoardModel = new DashboardModel();
    _dashoardModel.getDasboardData(function(dashboardData) {

        var _movieModel = new MovieModel();
        _movieModel.listMoviesIdIndex(function (movies) {

            //Liste mit den Filmen erstellen
            var newestMoviesList = [];
            for(var i in dashboardData.newestMovies) {

                if(movies[dashboardData.newestMovies[i]]) {

                    newestMoviesList[i] = movies[dashboardData.newestMovies[i]];
                }
            }

            var newestMovies = [];
            var j = 0;
            for(var i in newestMoviesList) {

                if(newestMoviesList[i] != undefined) {

                    newestMovies[j] = movieFormat(newestMoviesList[i]);
                    j++;
                }
            }

            //Seite an Browser senden
            res.render('newestmovies', {newestMovies: newestMovies});
        });
    });
}