/**
 * Created by oliver on 19.05.17.
 *
 * Filme Listen Controller
 */

const MovieModel = require('../model/moviemodel');
const Pagination = require('../util/pagination');
const Handlebars = require('handlebars');
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

        //Start Element
        var start = 0;
        if(req.query.start) {

            var start = req.query.start;
        }

        //Blätterfunktion
        var elementsAtPage = config.pagination.elementsAtPage;
        var elements = data.length;
        var pagination = new Pagination(elements, elementsAtPage, start);
        var paginationStr = '';

        if(pagination.lastPage > 1) {

            if(pagination.firstPage < pagination.previous2Page) {

                paginationStr += '<a class="item" href="/movies?start=0">1</a>';
                if(pagination.firstPage < (pagination.previous2Page - 1)) {

                    paginationStr += '<a class="item disabled">...</a>';
                }
            }
            if(pagination.previous2Page >= 1) {

                paginationStr += '<a class="item" href="/movies?start=' + ((pagination.previous2Page - 1) * pagination.elementsAtPage) + '">' + pagination.previous2Page + '</a>';
            }
            if(pagination.previousPage >= 1) {

                paginationStr += '<a class="item" href="/movies?start=' + ((pagination.previousPage - 1) * pagination.elementsAtPage) + '">' + pagination.previousPage + '</a>';
            }
            paginationStr += '<a class="item active">' + pagination.currentPage + '</a>';
            if(pagination.nextPage <= pagination.lastPage) {

                paginationStr += '<a class="item" href="/movies?start=' + ((pagination.nextPage - 1) * pagination.elementsAtPage) + '">' + pagination.nextPage + '</a>';
            }
            if(pagination.next2Page <= pagination.lastPage) {

                paginationStr += '<a class="item" href="/movies?start=' + ((pagination.next2Page - 1) * pagination.elementsAtPage) + '">' + pagination.next2Page + '</a>';
            }
            if(pagination.next2Page < pagination.lastPage) {

                if(pagination.next2Page + 1 < pagination.lastPage) {

                    paginationStr += '<a class="item disabled">...</a>';
                }
                paginationStr += '<a class="item" href="/movies?start=' + ((pagination.lastPage - 1) * pagination.elementsAtPage) + '">' + pagination.lastPage + '</a>';
            }
        }

        //Elemente auswählen
        var subData = [];
        var n = 0;
        for(var i = start; i < (parseInt(start) + parseInt(elementsAtPage)); i++) {
            if(data[i]) {

                subData[n] = data[i];
                n++;
            }
        }

        //Template an Browser
        res.render('list', {data: subData, pagination: new Handlebars.SafeString(paginationStr)});
    });

}