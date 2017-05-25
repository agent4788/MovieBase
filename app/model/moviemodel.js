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
     * Erstellt eine Liste mit Beispieldaten in der Datenbank
     */
    insertSampleData() {

        var client = this.__connect();

        //Filme
        for(var i = 0; i < 75; i++) {

            var movie1 = new Movie();
            movie1.id = this.__createId();
            movie1.title = 'Test Film ' + (i + 1);
            movie1.description = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.';
            movie1.disc = 'Blu-ray';
            movie1.coverImg = 'bsp.jpg';
            movie1.fsk = 16;
            movie1.duration = 115;
            movie1.genres = ['Action', 'Horror'];
            movie1.price = 19.99;
            movie1.rating = 4;

            client.hset('movies', movie1.id, JSON.stringify(movie1));
        }

        //Filmbox
        for(var i = 0; i < 5; i++) {

            var movieBox1 = new MovieBox();
            movieBox1.id = this.__createId();
            movieBox1.title = 'Filmbox ' + (i + 1);
            movieBox1.coverImg = 'king.jpg';
            movieBox1.year = 2015;
            movieBox1.price = 49.95;
            movieBox1.disc = 'Blu-ray';

            var movies = [];
            for(var j = 0; j < 3; j++) {

                var movie1 = new Movie();
                movie1.id = this.__createId();
                movie1.title = 'Filmbox ' + (i + 1) + ' Film ' + (j + 1);
                movie1.description = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.';
                movie1.disc = 'Blu-ray';
                movie1.coverImg = 'bsp.jpg';
                movie1.fsk = 16;
                movie1.duration = 115;
                movie1.genres = ['Action', 'Horror'];
                movie1.price = 19.99;
                movie1.rating = 4;
                movies[j] = movie1;
            }
            movieBox1.movies = movies;

            client.hset('movies', movieBox1.id, JSON.stringify(movieBox1));
        }

        client.quit();
    }

    /**
     * gibt eine Liste mit allen Filmen zurück
     *
     * @param callback Callback Funktion welche die Daten erhält
     */
    listMovies(callback) {

        var client = this.__connect();
        var movieModel = this;
        client.hgetall('movies', function (err, obj) {

            var data = [];
            var i = 0;
            for(var key in obj) {

                var json = JSON.parse(obj[key]);
                if(json._type == 1) {

                    //Film
                    json.__proto__ = Movie.prototype;
                    data[i] = json;
                    i++;
                } else if(json._type == 2) {

                    //Filmbox filme extrahieren
                    for(var j in json._movies) {

                        var boxMovie = json._movies[j];
                        boxMovie.__proto__ = Movie.prototype;
                        data[i] = boxMovie;
                        i++;
                    }
                }
            }

            //TODO Nach Entwicklung wieder entfernen
            if(data.length < 1) {
                movieModel.insertSampleData();
            }

            callback(data);
            client.quit();
        });
    }

    /**
     * gibt den zur ID zugehörigen Film zurück
     *
     * @param id
     * @param callback Callback Funktion welche die Daten erhält
     */
    getMovieById(id, callback) {

        var client = this.__connect();
        client.hget('movies', id, function (err, obj) {

            var json = JSON.parse(obj);
            if(json != null && json._type == 1) {

                //Film
                json.__proto__ = Movie.prototype;
                client.quit();
                callback(json);
            } else {

                //prüfen ob der Film in einer Filmbox enthalten ist
                client.hgetall('movies', function (err, obj) {

                    var boxId = '';
                    for(var key in obj) {

                        var json = JSON.parse(obj[key]);
                        if(json._type == 2) {

                            //Filme in Box durchsuchen
                            for(var j in json._movies) {

                                var boxMovie = json._movies[j];
                                if(boxMovie._id == id) {

                                    //Film in Box gefunden
                                    boxId = json._id;
                                    break;
                                }
                            }

                            //Prüfen ob Box gefunden
                            if(boxId.length > 0) {

                                //Filmbox Objekt erstellen
                                var movieBox = json;
                                movieBox.__proto__ = MovieBox.prototype;

                                var movies = [];
                                for(var n = 0; n < movieBox.movies.length; n++) {

                                    var movieJson = movieBox.movies[n];
                                    movieJson.__proto__ = Movie.prototype;
                                    movies[n] = movieJson;
                                }
                                movieBox.movies = movies;
                                callback(movieBox);
                                break;
                            }
                        }
                    }
                    client.quit();
                });
            }

        });
    }

}