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

        /*
        var movie1 = new Movie();
        movie1.id = this.__createId();
        movie1.title = 'Test Film 6';
        movie1.description = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.';
        movie1.disc = 'Blu-ray';
        movie1.coverImg = 'bsp.jpg';
        movie1.fsk = 16;
        movie1.duration = 115;
        movie1.genres = ['Action', 'Horror'];
        movie1.price = 19.99;
        movie1.rating = 4;

        var client = this.__connect();
        client.hset('movies', movie1.id, JSON.stringify(movie1));
        client.quit();
*/

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