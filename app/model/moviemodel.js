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
            movie1.duration = 75 + i;
            movie1.genre = 'Action';
            movie1.price = 19.99;
            movie1.rating = (i % 5) + 1;
            movie1.registredDate = '1980-01-01';

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
            movieBox1.registredDate = '1980-01-01';

            var movies = [];
            for(var j = 0; j < 3; j++) {

                var movie1 = new Movie();
                movie1.id = this.__createId();
                movie1.title = 'Filmbox ' + (i + 1) + ' Film ' + (j + 1);
                movie1.description = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.';
                movie1.disc = 'Blu-ray';
                movie1.coverImg = 'bsp.jpg';
                movie1.fsk = 16;
                movie1.duration = 90 + i;
                movie1.genre = 'Horror';
                movie1.price = 19.99;
                movie1.rating = (i % 5) + 1;
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

            /*
            //Testdaten einfügen
            if(data.length < 1) {
                movieModel.insertSampleData();
            }*/

            callback(data);
            client.quit();
        });
    }

    /**
     * gibt eine Liste mit allen Filmen zurück (Indexiert nach IDs)
     *
     * @param callback Callback Funktion welche die Daten erhält
     */
    listMoviesIdIndex(callback) {

        var client = this.__connect();
        var movieModel = this;
        client.hgetall('movies', function (err, obj) {

            var data = [];
            for(var key in obj) {

                var json = JSON.parse(obj[key]);
                if(json._type == 1) {

                    //Film
                    json.__proto__ = Movie.prototype;
                    data[json.id] = json;
                } else if(json._type == 2) {

                    //Filmbox filme extrahieren
                    for(var j in json._movies) {

                        var boxMovie = json._movies[j];
                        boxMovie.__proto__ = Movie.prototype;
                        data[boxMovie.id] = boxMovie;
                    }
                }
            }

            /*
            //Testdaten einfügen
            if(data.length < 1) {
                movieModel.insertSampleData();
            }*/

            callback(data);
            client.quit();
        });
    }

    /**
     * gibt eine Liste mit allen Filmen zurück
     *
     * @param callback Callback Funktion welche die Daten erhält
     */
    listOnlyMovies(callback) {

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
                }
            }

            callback(data);
            client.quit();
        });
    }

    /**
     * gibt eine Liste mit allen Filmen zurück
     *
     * @param callback Callback Funktion welche die Daten erhält
     */
    listMovieBoxes(callback) {

        var client = this.__connect();
        var movieModel = this;
        client.hgetall('movies', function (err, obj) {

            var data = [];
            var i = 0;
            for(var key in obj) {

                var json = JSON.parse(obj[key]);
                if(json._type == 2) {

                    //Filmbox filme extrahieren
                    json.__proto__ = MovieBox.prototype;
                    var movies = [];
                    for(var j in json.movies) {

                        var boxMovie = json.movies[j];
                        boxMovie.__proto__ = Movie.prototype;
                        movies[j] = boxMovie;
                    }
                    json.movies = movies;
                    data[i] = json;
                    i++;
                }
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

    /**
     * gibt die Filmbox mit der ID zurück
     *
     * @param id Filmbox ID
     * @param callback Callback Funktion welche die Daten erhält
     */
    getMovieBoxById(id, callback) {

        var client = this.__connect();
        var movieModel = this;
        client.hget('movies', id, function (err, obj) {

            var json = JSON.parse(obj);
            if(json._type == 2) {

                //Filmbox filme extrahieren
                json.__proto__ = MovieBox.prototype;
                var movies = [];
                for(var j in json.movies) {

                    var boxMovie = json.movies[j];
                    boxMovie.__proto__ = Movie.prototype;
                    movies[j] = boxMovie;
                }
                json.movies = movies;
                callback(json);
            } else {

                callback(null);
            }
            client.quit();
        });
    }

    /**
     * Film hinzufügen
     *
     * @param movie Film
     * @return ID des Films
     */
    addMovie(movie) {

        movie.id = this.__createId();
        var client = this.__connect();
        client.hset('movies', movie.id, JSON.stringify(movie));
        client.quit();
        return movie.id;
    }

    /**
     * Film bearbeiten
     *
     * @param movie Film
     * @return ID des Films
     */
    updateMovie(movie) {

        var client = this.__connect();
        client.hset('movies', movie.id, JSON.stringify(movie));
        client.quit();
        return movie.id;
    }

    /**
     * Film löschen
     *
     * @param id Film ID
     */
    deleteMovie(id) {

        var client = this.__connect();
        client.hdel('movies', id);
        client.quit();
    }

    /**
     * FilmBox hinzufügen
     *
     * @param movie FilmBox
     * @return ID der Filmbox
     */
    addMovieBox(movieBox) {

        movieBox.id = this.__createId();
        var client = this.__connect();
        client.hset('movies', movieBox.id, JSON.stringify(movieBox));
        client.quit();
        return movieBox.id;
    }

    /**
     * FilmBox bearbeiten
     *
     * @param movie FilmBox
     * @return ID der Filmbox
     */
    updateMovieBox(movieBox) {

        var client = this.__connect();
        client.hset('movies', movieBox.id, JSON.stringify(movieBox));
        client.quit();
        return movieBox.id;
    }

    /**
     * FilmBox löschen
     *
     * @param id FilmBox ID
     */
    deleteMovieBox(id) {

        var client = this.__connect();
        client.hdel('movies', id);
        client.quit();
    }

    /**
     * löscht alle Filme und Filmboxen aus der Datenbank
     *
     * @param callback
     */
    deleteAll(callback) {

        var client = this.__connect();
        var movieModel = this;
        client.del('movies', function (err, obj) {

            if(!err) {

                callback(true);
            } else {

                callback(false);
            }
            client.quit();
        });
    }
}