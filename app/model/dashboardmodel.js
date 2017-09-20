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
const SettingsModel = require('../model/settingsmodel');

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

            var _settingsModel = new SettingsModel();
            _settingsModel.getSettings(function (settings) {

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
                for(var i = 0; i < settings.dashboard.newestMoviesValue; i++) {

                    if(data[i] != undefined) {

                        dateFiltered[i] = data[i].id;
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
                for(var i = 0; i < settings.dashboard.bestMoviesValue; i++) {

                    if(data[i] != undefined) {

                        ratingFiltered[i] = data[i].id;
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
                client.expire('dashboard', settings.dashboard.cacheTime);

                //Datenbankverbindung trennen
                client.quit();

                callback(dasboardData);
            });
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

                //Daten zurückgeben
                callback(dashboardData);
            }
        })
    }

    /**
     * löscht den Cache
     *
     * @param callback
     */
    deleteCache(callback) {

        //Datenbank verbinden
        let client = this.__connect();
        client.del('dashboard', function (err, obj) {

            if(!err) {

                callback(true);
            } else {

                callback(false);
            }
            client.quit();
        });
    }
};