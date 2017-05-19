/**
 * Created by oliver on 19.05.17.
 *
 * Datenverwaltung
 */

'use strict';

const Movie = require('./movie');
const MovieBox = require('./moviebox');

var redis = require('redis');
const crypto = require('crypto');
const config = require('../config');

module.exports = class MovieModel {

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
     * generiert einen 20 stelligen Hash
     *
     * @private
     */
    __createId() {

        return crypto.randomBytes(20).toString('hex');
    }

    /**
     * gibt eine Liste mit allen Filmen zurück
     *
     * @param callback Callback Funktion welche die Daten erhält
     */
    listMovies(callback) {

        var client = this.__connect();
        client.hgetall('movies', function (err, obj) {

            var data = [];
            var i = 0;
            for(var key in obj) {

                var json = JSON.parse(obj[key]);
                if(json._type == 1) {

                    //Film
                    json.__proto__ = Movie.prototype;
                    data[i] = json;
                } else if(data._type) {

                    //Filmbox
                    json.__proto__ = MovieBox.prototype;
                    data[i] = json;
                }
                i++;
            }
            callback(data);
            client.quit();
        });
    }

}