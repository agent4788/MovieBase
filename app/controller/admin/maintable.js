/**
 * Created by oliver on 31.05.17.
 *
 * Admin Controller
 */

const MovieModel = require('../../model/moviemodel');
const Pagination = require('../../util/pagination');
const Handlebars = require('handlebars');
const config = require('../../config');
const movieFormat = require('../../util/movieFormat');

module.exports = function(req, res) {

    //Formulardaten prüfen
    //TODO Eingabedaten filtern
    var searchParameters = {
        title: (req.query.title ? req.query.title : '')
    };

    //film ID
    var id = '';
    if(req.query.id && req.query.id.length > 10) {

        id = req.query.id;
    }

    var movieModel = new MovieModel();
    movieModel.listOnlyMovies(function(data) {

        //Nach Suchkriterien filtern
        var filterActive = false;
        var filtered = [];
        var j = 0;
        for(var i = 0; i < data.length; i++) {

            var movie = data[i];

            //Nacht Titel/Subtitel filtern
            if(searchParameters.title.length > 0) {

                if(!(movie.title.toLocaleLowerCase().search(searchParameters.title.toLocaleLowerCase()) > -1) && !(movie.subTitle.toLowerCase().search(searchParameters.title.toLocaleLowerCase()) > -1)) {

                    filterActive = true;
                    continue;
                }
            }

            filtered[j] = movie;
            j++;
        }
        data = filtered;

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

            start = parseInt(req.query.start);
        }

        //Position in der Filmeliste suchen und das passende Start Element setzen
        if(id.length > 10) {

            for(var i in data) {

                if(data[i].id == id) {

                    start = i - (i % config.pagination.elementsAtPage);
                    break;
                }
            }
        }

        //Blätterfunktion
        var elementsAtPage = config.pagination.elementsAtPage;
        var elements = data.length;
        var pagination = new Pagination(elements, elementsAtPage, start);
        var paginationStr = '';

        if(pagination.lastPage > 1) {

            if(pagination.firstPage < pagination.previous2Page) {

                paginationStr += '<a class="item" href="/admin?start=0">1</a>';
                if(pagination.firstPage < (pagination.previous2Page - 1)) {

                    paginationStr += '<a class="item disabled">...</a>';
                }
            }
            if(pagination.previous2Page >= 1) {

                paginationStr += '<a class="item" href="/admin?start=' + ((pagination.previous2Page - 1) * pagination.elementsAtPage) + '">' + pagination.previous2Page + '</a>';
            }
            if(pagination.previousPage >= 1) {

                paginationStr += '<a class="item" href="/admin?start=' + ((pagination.previousPage - 1) * pagination.elementsAtPage) + '">' + pagination.previousPage + '</a>';
            }
            paginationStr += '<a class="item active">' + pagination.currentPage + '</a>';
            if(pagination.nextPage <= pagination.lastPage) {

                paginationStr += '<a class="item" href="/admin?start=' + ((pagination.nextPage - 1) * pagination.elementsAtPage) + '">' + pagination.nextPage + '</a>';
            }
            if(pagination.next2Page <= pagination.lastPage) {

                paginationStr += '<a class="item" href="/admin?start=' + ((pagination.next2Page - 1) * pagination.elementsAtPage) + '">' + pagination.next2Page + '</a>';
            }
            if(pagination.next2Page < pagination.lastPage) {

                if(pagination.next2Page + 1 < pagination.lastPage) {

                    paginationStr += '<a class="item disabled">...</a>';
                }
                paginationStr += '<a class="item" href="/admin?start=' + ((pagination.lastPage - 1) * pagination.elementsAtPage) + '">' + pagination.lastPage + '</a>';
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

        //Meldungen
        var success = {
            add: false,
            addSuccess: false,
            edit: false,
            editSuccess: false,
            delete: false,
            deleteSuccess: false,
        };

        if(req.query.addSuccess !== undefined) {

            success.add = true;
            success.addSuccess = req.query.addSuccess;
        }

        if(req.query.editSuccess !== undefined) {

            success.edit = true;
            success.editSuccess = req.query.editSuccess;
        }

        if(req.query.deleteSuccess !== undefined) {

            success.delete = true;
            success.deleteSuccess = req.query.deleteSuccess;
        }

        //Template an Browser
        res.render('admin/maintable', {
            layout: 'adminlayout',
            data: subData,
            pagination: new Handlebars.SafeString(paginationStr),
            success: success,
            searchParameters: searchParameters,
            found: (filterActive && subData.length > 0 ? true : false),
            founds: data.length
        });
    });
}