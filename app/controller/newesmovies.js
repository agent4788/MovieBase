/**
 * Created by oliver on 29.07.17.
 *
 * Neuste Filme Controller
 */

const DashboardModel = require('../model/dashboardmodel');
const MovieModel = require('../model/moviemodel');
const movieFormat = require('../util/movieFormat');
const SettingsModel = require('../model/settingsmodel');
const Handlebars = require('handlebars');
const Pagination = require('../util/pagination');

module.exports = function(req, res) {

    var _dashoardModel = new DashboardModel();
    _dashoardModel.getDasboardData(function(dashboardData) {

        var _movieModel = new MovieModel();
        _movieModel.listMoviesIdIndex(function (movies) {

            var _settingsModel = new SettingsModel();
            _settingsModel.getSettings(function (settings) {

                //Liste mit den Filmen erstellen
                var newestMoviesList = [];
                for(var i in dashboardData.newestMovies) {

                    if(movies[dashboardData.newestMovies[i]]) {

                        newestMoviesList[i] = movies[dashboardData.newestMovies[i]];
                    }
                }
                var data = newestMoviesList;

                //Start Element
                var start = 0;
                if (req.query.start) {

                    var start = parseInt(req.query.start);
                }

                //Blätterfunktion
                var elementsAtPage = settings.pagination.elementsAtPage;
                var elements = data.length;
                var pagination = new Pagination(elements, elementsAtPage, start);
                var paginationStr = '';

                if (pagination.lastPage > 1) {

                    if (pagination.firstPage < pagination.previous2Page) {

                        paginationStr += '<a class="item" href="/new?start=0">1</a>';
                        if (pagination.firstPage < (pagination.previous2Page - 1)) {

                            paginationStr += '<a class="item disabled">...</a>';
                        }
                    }
                    if (pagination.previous2Page >= 1) {

                        paginationStr += '<a class="item" href="/new?start=' + ((pagination.previous2Page - 1) * pagination.elementsAtPage) + '">' + pagination.previous2Page + '</a>';
                    }
                    if (pagination.previousPage >= 1) {

                        paginationStr += '<a class="item" href="/new?start=' + ((pagination.previousPage - 1) * pagination.elementsAtPage) + '">' + pagination.previousPage + '</a>';
                    }
                    paginationStr += '<a class="item active">' + pagination.currentPage + '</a>';
                    if (pagination.nextPage <= pagination.lastPage) {

                        paginationStr += '<a class="item" href="/new?start=' + ((pagination.nextPage - 1) * pagination.elementsAtPage) + '">' + pagination.nextPage + '</a>';
                    }
                    if (pagination.next2Page <= pagination.lastPage) {

                        paginationStr += '<a class="item" href="/new?start=' + ((pagination.next2Page - 1) * pagination.elementsAtPage) + '">' + pagination.next2Page + '</a>';
                    }
                    if (pagination.next2Page < pagination.lastPage) {

                        if (pagination.next2Page + 1 < pagination.lastPage) {

                            paginationStr += '<a class="item disabled">...</a>';
                        }
                        paginationStr += '<a class="item" href="/new?start=' + ((pagination.lastPage - 1) * pagination.elementsAtPage) + '">' + pagination.lastPage + '</a>';
                    }
                }

                //Elemente auswählen
                var subData = [];
                var n = 0;
                for (var i = start; i < (parseInt(start) + parseInt(elementsAtPage)); i++) {

                    if (data[i]) {

                        subData[n] = movieFormat(data[i]);
                        n++;
                    }
                }

                //Seite an Browser senden
                res.render('newestmovies', {newestMovies: subData, pagination: new Handlebars.SafeString(paginationStr)});
            });
        });
    });
}