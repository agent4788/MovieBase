/**
 * Created by oliver on 29.07.17.
 *
 * Neuste Filme Controller
 */

const DashboardModel = require('../model/dashboardmodel');
const movieFormat = require('../util/movieFormat');

module.exports = function(req, res) {

    var _dashoardModel = new DashboardModel();
    _dashoardModel.getDasboardData(function(data) {

        var newestMovies = [];
        for(var i in data.newestMovies) {

            newestMovies[i] = movieFormat(data.newestMovies[i]);
        }

        //Seite an Browser senden
        res.render('newestmovies', {newestMovies: newestMovies});
    });
}