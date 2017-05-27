/**
 * Created by oliver on 19.05.17.
 *
 * Filme Listen Controller
 */

const MovieModel = require('../model/moviemodel');
const Pagination = require('../util/pagination');
const Handlebars = require('handlebars');
const config = require('../config');
const movieFormat = require('../util/movieFormat');

module.exports = function(req, res) {

    var movieModel = new MovieModel();
    movieModel.listMovies(function(data) {

        //Daten nach Titel aufsteigend sortieren
        data.sort(function(obj1, obj2) {

            as = obj1.title;
            bs = obj2.title;
            var a, b, a1, b1, rx=/(\d+)|(\D+)/g, rd=/\d+/;
            a= String(as).toLowerCase().match(rx);
            b= String(bs).toLowerCase().match(rx);
            while(a.length && b.length){
                a1= a.shift();
                b1= b.shift();
                if(rd.test(a1) || rd.test(b1)){
                    if(!rd.test(a1)) return 1;
                    if(!rd.test(b1)) return -1;
                    if(a1!= b1) return a1-b1;
                }
                else if(a1!= b1) return a1> b1? 1: -1;
            }
            return a.length- b.length;
        });

        //Start Element
        var start = 0;
        if(req.query.start) {

            var start = parseInt(req.query.start);
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

                subData[n] = movieFormat(data[i]);
                n++;
            }
        }

        //Template an Browser
        res.render('list', {data: subData, pagination: new Handlebars.SafeString(paginationStr)});
    });

}