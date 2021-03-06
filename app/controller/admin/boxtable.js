/**
 * Created by oliver on 02.07.17.
 *
 * Filmboxen Liste Controller
 */

const MovieModel = require('../../model/moviemodel');
const SettingsModel = require('../../model/settingsmodel');
const Pagination = require('../../util/pagination');
const Handlebars = require('handlebars');
const movieFormat = require('../../util/movieFormat');
const Entities = require('html-entities').Html5Entities;
const entities = new Entities();

module.exports = function(req, res) {

    //Formulardaten prüfen
    //TODO Eingabedaten filtern
    var searchParameters = {
        title: (req.query.title ? req.query.title : ''),
        disc: (req.query.disc ? req.query.disc : {})
    };
    if(typeof req.query.disc == 'string') {

        searchParameters.disc = [req.query.disc];
    }

    var movieModel = new MovieModel();
    movieModel.listMovieBoxes(function(data) {

        var _settingsModel = new SettingsModel();
        _settingsModel.getSettings(function (settings) {

            //Nach Suchkriterien filtern
            var filterActive = false;
            var titleFiltered = [];
            var j = 0;
            for (var i = 0; i < data.length; i++) {

                var movieBox = data[i];

                //Nacht Titel/Subtitel filtern
                if (searchParameters.title.length > 0) {

                    if (!(movieBox.title.toLocaleLowerCase().search(searchParameters.title.toLocaleLowerCase()) > -1) && !(movieBox.subTitle.toLowerCase().search(searchParameters.title.toLocaleLowerCase()) > -1)) {

                        filterActive = true;
                        continue;
                    }
                }

                titleFiltered[j] = movieBox;
                j++;
            }

            var discFiltered = [];
            if(searchParameters.disc.length > 0) {

                var j = 0;
                for (var i = 0; i < titleFiltered.length; i++) {

                    var movie = titleFiltered[i];

                    //Nacht Titel/Subtitel filtern
                    if (!(searchParameters.disc.indexOf(movie.disc) >= 0)) {

                        filterActive = true;
                        continue;
                    }

                    discFiltered[j] = movie;
                    j++;
                }
            } else {

                discFiltered = titleFiltered;
            }
            data = discFiltered;

            //Daten nach Titel aufsteigend sortieren
            data.sort(function (obj1, obj2) {

                as = obj1.title;
                bs = obj2.title;
                var a, b, a1, b1, rx = /(\d+)|(\D+)/g, rd = /\d+/;
                a = String(as).toLowerCase().match(rx);
                b = String(bs).toLowerCase().match(rx);
                while (a.length && b.length) {
                    a1 = a.shift();
                    b1 = b.shift();
                    if (rd.test(a1) || rd.test(b1)) {
                        if (!rd.test(a1)) return 1;
                        if (!rd.test(b1)) return -1;
                        if (a1 != b1) return a1 - b1;
                    }
                    else if (a1 != b1) return a1 > b1 ? 1 : -1;
                }
                return a.length - b.length;
            });

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

                var queryStr = queryString(searchParameters);
                if (pagination.firstPage < pagination.previous2Page) {

                    paginationStr += '<a class="item" href="/admin/boxes?' + queryStr + '&start=0">1</a>';
                    if (pagination.firstPage < (pagination.previous2Page - 1)) {

                        paginationStr += '<a class="item disabled">...</a>';
                    }
                }
                if (pagination.previous2Page >= 1) {

                    paginationStr += '<a class="item" href="/admin/boxes?' + queryStr + '&start=' + ((pagination.previous2Page - 1) * pagination.elementsAtPage) + '">' + pagination.previous2Page + '</a>';
                }
                if (pagination.previousPage >= 1) {

                    paginationStr += '<a class="item" href="/admin/boxes?' + queryStr + '&start=' + ((pagination.previousPage - 1) * pagination.elementsAtPage) + '">' + pagination.previousPage + '</a>';
                }
                paginationStr += '<a class="item active">' + pagination.currentPage + '</a>';
                if (pagination.nextPage <= pagination.lastPage) {

                    paginationStr += '<a class="item" href="/admin/boxes?' + queryStr + '&start=' + ((pagination.nextPage - 1) * pagination.elementsAtPage) + '">' + pagination.nextPage + '</a>';
                }
                if (pagination.next2Page <= pagination.lastPage) {

                    paginationStr += '<a class="item" href="/admin/boxes?' + queryStr + '&start=' + ((pagination.next2Page - 1) * pagination.elementsAtPage) + '">' + pagination.next2Page + '</a>';
                }
                if (pagination.next2Page < pagination.lastPage) {

                    if (pagination.next2Page + 1 < pagination.lastPage) {

                        paginationStr += '<a class="item disabled">...</a>';
                    }
                    paginationStr += '<a class="item" href="/admin/boxes?' + queryStr + '&start=' + ((pagination.lastPage - 1) * pagination.elementsAtPage) + '">' + pagination.lastPage + '</a>';
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

            //Meldungen
            var success = {
                add: false,
                addSuccess: false,
                edit: false,
                editSuccess: false,
                delete: false,
                deleteSuccess: false,
            };

            if (req.query.addSuccess !== undefined) {

                success.add = true;
                success.addSuccess = req.query.addSuccess;
            }

            if (req.query.editSuccess !== undefined) {

                success.edit = true;
                success.editSuccess = req.query.editSuccess;
            }

            if (req.query.deleteSuccess !== undefined) {

                success.delete = true;
                success.deleteSuccess = req.query.deleteSuccess;
            }

            if (req.query.manageSuccess !== undefined) {

                success.manage = true;
                success.manageSuccess = req.query.manageSuccess;
            }

            //Template an Browser
            res.render('admin/boxtable', {
                layout: 'adminlayout',
                data: subData,
                pagination: new Handlebars.SafeString(paginationStr),
                success: success,
                found: (filterActive && subData.length > 0 ? true : false),
                founds: data.length,
                config: settings,
                searchParameters: searchParameters
            });
        });
    });
};

function queryString(searchParameters) {

    var queryStr = '';
    var and = '';

    if(searchParameters.title.length > 0) {

        queryStr += 'title=' + entities.encode(searchParameters.title);
        and = '&';
    }

    if(searchParameters.disc.length > 0) {

        searchParameters.disc.forEach(disc => {

            queryStr += and + 'disc=' + entities.encode(disc);
            and = '&';
        });
    }
    return queryStr;
}