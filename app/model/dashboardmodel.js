/**
 * Created by oliver on 24.07.17.
 *
 * Dashboardverwaltung
 */

const MovieModel = require('./moviemodel');
const Movie = require('./movie');
const redis = require('redis');
const config = require('../config');
const moment = require('moment');

'use strict';

module.exports = class DashboardModel {

    /**
     * Datenbankverbindung herstellen
     *
     * @private
     */
    __connect() {

        var dbConfig = {
            host: config.database.host,
            port: config.database.port,
            db: config.database.db
        };
        if(config.database.password.length > 0) {
            dbConfig.password = config.database.password;
        }
        return redis.createClient(dbConfig);
    }

    /**
     * aktualisiert den Dashboard Cache
     *
     * @param callback
     */
    updateDashboardData(callback) {

        //Datenbank verbinden
        var client = this.__connect();
        var _movieModel = new MovieModel();
        _movieModel.listMovies(function(data) {

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // neuste Filme ////////////////////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            //Daten nach Datum sortieren
            data.sort(function(obj1, obj2) {

                if(moment(obj1.registredDate).isBefore(obj2.registredDate)) {

                    return 1;
                } else if(moment(obj1.registredDate).isSame(obj2.registredDate)) {

                    return 0;
                } else if(moment(obj1.registredDate).isAfter(obj2.registredDate)) {

                    return -1;
                }
            });

            //die ersten x Elemente in ein eigenes Array kopieren
            var dateFiltered = [];
            for(var i = 0; i < config.dashboard.newestMoviesValue; i++) {

                if(data[i] != undefined) {

                    dateFiltered[i] = data[i];
                } else {

                    break;
                }
            }

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // beste Filme /////////////////////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            //Daten nach Bewertung sortieren
            data.sort(function(obj1, obj2) {

                if(obj1.rating < obj2.rating) {

                    return 1;
                } else if(obj1.rating == obj2.rating) {

                    return 0;
                } else if(obj1.rating > obj2.rating) {

                    return -1;
                }
            });

            //die ersten x Elemente in ein eigenes Array kopieren
            var ratingFiltered = [];
            for(var i = 0; i < config.dashboard.bestMoviesValue; i++) {

                if(data[i] != undefined) {

                    ratingFiltered[i] = data[i];
                } else {

                    break;
                }
            }

            var dasboardData = {
                newestMovies: dateFiltered,
                bestMovies: ratingFiltered
            };

            //in cahce speichern
            client.set('dashboard', JSON.stringify(dasboardData));
            client.expire('dashboard', config.dashboard.cacheTime);

            //Datenbankverbindung trennen
            client.quit();

            callback(dasboardData);
        });
    }

    /**
     * liest die Dashboard Cache Daten und gibt sie zurück
     *
     * @param callback
     */
    getDasboardData(callback) {

        //Datenbank verbinden
        var client = this.__connect();

        //prüfen ob daten vorhanden
        var dashboardModel = this;
        client.get('dashboard', function (err, data) {

            //prüfen ob Schlüssel vorhanden
            if(data === null) {

                //Daten erneuern
                dashboardModel.updateDashboardData(function(data) {

                    callback(data);
                });
            } else {

                //Daten aus Datenbank laden
                var dashboardData = JSON.parse(data);

                //Objekte wierherstellen
                var newestMovies = [];
                for(var i in dashboardData.newestMovies) {

                    var json = dashboardData.newestMovies[i];
                    var _movie = new Movie();
                    _movie.id = json._id;
                    _movie.title = json._title;
                    _movie.subTitle = json._subTitle;
                    _movie.description = json._description;
                    _movie.coverImg = json._coverImg;
                    _movie.year = json._year;
                    _movie.disc = json._disc;
                    _movie.price = json._price;
                    _movie.duration = json._duration;
                    _movie.fsk = json._fsk;
                    _movie.genre = json._genre;
                    _movie.rating = json._rating;
                    _movie.registredDate = json._registredDate;
                    newestMovies[i] = _movie;
                };
                var bestMovies = [];
                for(var i in dashboardData.bestMovies) {

                    var json = dashboardData.bestMovies[i];
                    var _movie = new Movie();
                    _movie.id = json._id;
                    _movie.title = json._title;
                    _movie.subTitle = json._subTitle;
                    _movie.description = json._description;
                    _movie.coverImg = json._coverImg;
                    _movie.year = json._year;
                    _movie.disc = json._disc;
                    _movie.price = json._price;
                    _movie.duration = json._duration;
                    _movie.fsk = json._fsk;
                    _movie.genre = json._genre;
                    _movie.rating = json._rating;
                    _movie.registredDate = json._registredDate;
                    bestMovies[i] = _movie;
                };

                //Daten zurückgeben
                callback({
                    newestMovies: newestMovies,
                    bestMovies: bestMovies
                })
            }
        })
    }
};