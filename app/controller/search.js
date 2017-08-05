/**
 * Created by oliver on 26.05.17.
 *
 * Suchfunktion
 */

const MovieModel = require('../model/moviemodel');
const SettingsModel = require('../model/settingsmodel');
const Pagination = require('../util/pagination');
const Handlebars = require('handlebars');
const Entities = require('html-entities').Html5Entities;
const entities = new Entities();
const movieFormat = require('../util/movieFormat');

module.exports = function(req, res) {

    var _settingsModel = new SettingsModel();
    _settingsModel.getSettings(function (settings) {

        //Formulardaten prüfen
        //TODO Eingabedaten filtern
        var searchParameters = {
            title: (req.query.title ? req.query.title : ''),
            minLength: (req.query.min_length ? parseInt(req.query.min_length) : ''),
            maxLength: (req.query.max_length ? parseInt(req.query.max_length) : ''),
            genre: (req.query.genre ? req.query.genre : ''),
            rating: (req.query.rating ? req.query.rating.toLocaleLowerCase() : ''),
        };
        if(typeof req.query.actors == 'string') {

            searchParameters.actors = [req.query.actors];
        } else if(typeof req.query.actors == 'object') {

            searchParameters.actors = req.query.actors;
        } else {

            searchParameters.actors = [];
        }
        if(typeof req.query.directors == 'string') {

            searchParameters.directors = [req.query.directors];
        } else if(typeof req.query.directors == 'object') {

            searchParameters.directors = req.query.directors;
        } else {

            searchParameters.directors = [];
        }

        //Liste mit allen Filmen Holen
        var movieModel = new MovieModel();
        var filterActive = false;
        movieModel.listMovies(function (data) {

            //Nach Suchkriterien filtern
            var filtered = [];
            var j = 0;
            for (var i = 0; i < data.length; i++) {

                var movie = data[i];

                //Nacht Titel/Subtitel filtern
                if (searchParameters.title.length > 0) {

                    if (!(movie.title.toLocaleLowerCase().search(searchParameters.title.toLocaleLowerCase()) > -1) && !(movie.subTitle.toLowerCase().search(searchParameters.title.toLocaleLowerCase()) > -1)) {

                        filterActive = true;
                        continue;
                    }
                }

                //Länge Filtern
                var lengthFiltered = [];
                if (searchParameters.minLength !== '' || searchParameters.maxLength !== '') {

                    if (searchParameters.minLength !== '' && searchParameters.maxLength === '') {

                        //nur Minimale länge
                        if (!(movie.duration >= searchParameters.minLength)) {

                            filterActive = true;
                            continue;
                        }
                    } else if (searchParameters.minLength === '' && searchParameters.maxLength !== '') {

                        //nur Maximale Länge
                        if (!(movie.duration <= searchParameters.maxLength)) {

                            filterActive = true;
                            continue;
                        }
                    } else if (searchParameters.minLength !== '' && searchParameters.maxLength !== '') {

                        //Beides
                        if (!(movie.duration >= searchParameters.minLength) || !(movie.duration <= searchParameters.maxLength)) {

                            filterActive = true;
                            continue;
                        }
                    }
                }

                //Genre Filtern
                if (searchParameters.genre.length > 0) {

                    var genre = movie.genre;
                    if (!(genre.toLocaleLowerCase() == searchParameters.genre.toLocaleLowerCase())) {

                        filterActive = true;
                        continue;
                    }
                }

                //Bewertung Filtern
                if (searchParameters.rating.length > 0) {

                    if (!(movie.rating >= searchParameters.rating)) {

                        filterActive = true;
                        continue;
                    }
                }

                //Regisseure filtern
                if(searchParameters.directors.length > 0) {

                    var directorFound = false;
                    var directorFoundCount = 0;
                    searchParameters.directors.forEach(director => {

                        if (movie.directors && movie.directors.indexOf(director) >= 0) {

                            directorFound = true;
                            directorFoundCount++;
                        }
                    });
                    if (directorFound == false || directorFoundCount != searchParameters.directors.length) {

                        filterActive = true;
                        continue;
                    }
                }

                //Schauspieler filtern
                if(searchParameters.actors.length > 0) {

                    var actorFound = false;
                    var actorFoundCount = 0;
                    searchParameters.actors.forEach(actor => {

                        if (movie.actors && movie.actors.indexOf(actor) >= 0) {

                            actorFound = true;
                            actorFoundCount++;
                        }
                    });
                    if (actorFound == false || actorFoundCount != searchParameters.actors.length) {

                        filterActive = true;
                        continue;
                    }
                }

                filtered[j] = movie;
                j++;
            }

            //Ergebnisse sortieren
            filtered.sort(function (obj1, obj2) {

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
            var elements = filtered.length;
            var pagination = new Pagination(elements, elementsAtPage, start);
            var paginationStr = '';

            if (pagination.lastPage > 1) {

                var queryStr = queryString(searchParameters);
                if (pagination.firstPage < pagination.previous2Page) {

                    paginationStr += '<a class="item" href="/search?' + queryStr + '&start=0">1</a>';
                    if (pagination.firstPage < (pagination.previous2Page - 1)) {

                        paginationStr += '<a class="item disabled">...</a>';
                    }
                }
                if (pagination.previous2Page >= 1) {

                    paginationStr += '<a class="item" href="/search?' + queryStr + '&start=' + ((pagination.previous2Page - 1) * pagination.elementsAtPage) + '">' + pagination.previous2Page + '</a>';
                }
                if (pagination.previousPage >= 1) {

                    paginationStr += '<a class="item" href="/search?' + queryStr + '&start=' + ((pagination.previousPage - 1) * pagination.elementsAtPage) + '">' + pagination.previousPage + '</a>';
                }
                paginationStr += '<a class="item active">' + pagination.currentPage + '</a>';
                if (pagination.nextPage <= pagination.lastPage) {

                    paginationStr += '<a class="item" href="/search?' + queryStr + '&start=' + ((pagination.nextPage - 1) * pagination.elementsAtPage) + '">' + pagination.nextPage + '</a>';
                }
                if (pagination.next2Page <= pagination.lastPage) {

                    paginationStr += '<a class="item" href="/search?' + queryStr + '&start=' + ((pagination.next2Page - 1) * pagination.elementsAtPage) + '">' + pagination.next2Page + '</a>';
                }
                if (pagination.next2Page < pagination.lastPage) {

                    if (pagination.next2Page + 1 < pagination.lastPage) {

                        paginationStr += '<a class="item disabled">...</a>';
                    }
                    paginationStr += '<a class="item" href="/search?' + queryStr + '&start=' + ((pagination.lastPage - 1) * pagination.elementsAtPage) + '">' + pagination.lastPage + '</a>';
                }
            }

            //Elemente auswählen
            var subData = [];
            var n = 0;
            for (var i = start; i < (parseInt(start) + parseInt(elementsAtPage)); i++) {

                if (filtered[i]) {

                    subData[n] = movieFormat(filtered[i]);
                    n++;
                }
            }

            //Template an Browser
            res.render('search', {
                config: settings,
                searchParameters: searchParameters,
                data: subData,
                pagination: new Handlebars.SafeString(paginationStr),
                found: (filterActive && subData.length > 0 ? true : false),
                founds: filtered.length
            });
        });
    });
}

function queryString(searchParameters) {

    var queryStr = '';
    var and = '';

    if(searchParameters.title.length > 0) {

        queryStr += 'title=' + entities.encode(searchParameters.title);
        and = '&';
    }

    if(searchParameters.minLength !== '') {

        queryStr += and + 'min_length=' + entities.encode(searchParameters.minLength.toString());
        and = '&';
    }

    if(searchParameters.maxLength !== '') {

        queryStr += and + 'max_length=' + entities.encode(searchParameters.maxLength.toString());
        and = '&';
    }

    if(searchParameters.genre.length > 0) {

        queryStr += and + 'genre=' + entities.encode(searchParameters.genre);
        and = '&';
    }

    if(searchParameters.rating.length > 0) {

        queryStr += and + 'rating=' + entities.encode(searchParameters.rating);
    }
    return queryStr;
}

