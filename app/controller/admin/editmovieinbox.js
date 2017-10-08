/**
 * Created by oliver on 24.06.17.
 *
 * Admin Controller
 */

const MovieModel = require('../../model/moviemodel');
const SettingsModel = require('../../model/settingsmodel');
const Movie = require('../../model/movie');
const MovieBox = require('../../model/moviebox');
const Handlebars = require('handlebars');
const crypto = require('crypto');
const movieFormat = require('../../util/movieFormat');
const fs = require('fs');

module.exports = {

    get: function (req, res) {

        var movieModel = new MovieModel();
        movieModel.getMovieById(req.params.id, function(data) {

            var _settingsModel = new SettingsModel();
            _settingsModel.getSettings(function (settings) {

                //Formular anzeigen

                if (data instanceof MovieBox) {

                    //Liste der Jahre
                    var year = new Date().getYear() + 1900;
                    var years = [];
                    for (var i = year, j = 0; i >= 1900; i--, j++) {
                        years[j] = i;
                    }

                    //Film in der Box finden
                    var movie = null;
                    var found = false;
                    for (var i in data.movies) {

                        if (data.movies[i].id == req.params.id) {

                            movie = data.movies[i];
                            found = true;
                        }
                    }

                    //Film nicht gefunden
                    if (found == false) {

                        res.redirect("/admin/manageMovieBoxMovies/" + data.id + "?editMovieInBoxSuccess=0");
                    }

                    //Template an Browser
                    res.render('admin/editmovieinbox', {
                        layout: 'adminlayout',
                        config: settings,
                        years: years,
                        movie: movie
                    });
                } else {

                    res.redirect("/admin/manageMovieBoxMovies/" + data.id + "?editMovieInBoxSuccess=0");
                }
            });
        });
    },
    post: function (req, res) {

        var movieModel = new MovieModel();
        movieModel.getMovieById(req.params.id, function(data) {

            var _settingsModel = new SettingsModel();
            _settingsModel.getSettings(function (settings) {

                if (data instanceof MovieBox) {

                    //Film in der Box finden
                    var movie = null;
                    var found = false;
                    for (var i in data.movies) {

                        if (data.movies[i].id == req.params.id) {

                            movie = data.movies[i];
                            found = true;
                        }
                    }

                    //Film nicht gefunden
                    if (found == false) {

                        res.redirect("/admin/manageMovieBoxMovies/" + data.id + "?editMovieInBoxSuccess=0");
                    }
                    newMovie = movie;
                    newMovie.registredDate = data.registredDate;

                    //Formulardaten verarbeiten
                    var title = req.body.title.trim();
                    var subTitle = req.body.subtitle.trim();
                    var description = req.body.description.trim();
                    var cover = req.files.cover;
                    var year = parseInt(req.body.year);
                    var disc = req.body.disc;
                    var duration = parseInt(req.body.duration);
                    var fsk = parseInt(req.body.fsk);
                    var genre = req.body.genre;
                    var rating = parseInt(req.body.rating);
                    var directors = req.body.directors;
                    var actors = req.body.actors;

                    //Film
                    var success = true;

                    //Titel
                    if (title.length > 0 && title.length <= 100) {

                        newMovie.title = title;
                    } else {

                        success = false;
                    }

                    //Untertitel
                    if (subTitle.length >= 0 && subTitle.length <= 100) {

                        newMovie.subTitle = subTitle;
                    } else {

                        success = false;
                    }

                    //Beschreibung
                    if (description.length <= 50000) {

                        newMovie.description = description;
                    } else {

                        success = false;
                    }

                    //Produktionsjahr
                    if (year >= 1900 && year <= (new Date().getYear() + 1900)) {

                        newMovie.year = year;
                    } else {

                        success = false;
                    }

                    //Medium
                    if (settings.disc.indexOf(disc) >= 0) {

                        newMovie.disc = disc;
                    } else {

                        success = false;
                    }

                    //Laufzeit
                    if (duration >= 0 && duration <= 10000) {

                        newMovie.duration = duration;
                    } else {

                        success = false;
                    }

                    //Medium
                    if (settings.fsk.indexOf(fsk) >= 0) {

                        newMovie.fsk = fsk;
                    } else {

                        success = false;
                    }

                    //Genre
                    if (settings.genres.indexOf(genre) >= 0) {

                        newMovie.genre = genre;
                    } else {

                        success = false;
                    }

                    //Bewertung
                    if (rating >= 1 && rating <= 5) {

                        newMovie.rating = rating;
                    } else {

                        success = false;
                    }

                    //Regisseure
                    var filteredDirectors = [];
                    var j = 0;
                    if (typeof directors == 'string') {

                        filteredDirectors[j] = directors;
                    } else {

                        for (var i in directors) {

                            if (settings.directors.indexOf(directors[i]) >= 0) {

                                filteredDirectors[j] = directors[i];
                                j++;
                            }
                        }
                    }
                    newMovie.directors = filteredDirectors;

                    //Schauspieler
                    var filteredActors = [];
                    var j = 0;
                    if (typeof actors == 'string') {

                        filteredActors[j] = actors;
                    } else {

                        for (var i in actors) {

                            if (settings.actors.indexOf(actors[i]) >= 0) {

                                filteredActors[j] = actors[i];
                                j++;
                            }
                        }
                    }
                    newMovie.actors = filteredActors;

                    if (success == false) {

                        //zur Übersicht umleiten
                        res.redirect("/admin/manageMovieBoxMovies/" + newMovie.id + "?editMovieInBoxSuccess=0");
                    }

                    //Cover (optional)
                    if (cover != null) {

                        //Cover hochgeladen
                        if (cover.mimetype == "image/jpeg"
                            || cover.mimetype == "image/png"
                            || cover.mimetype == "image/gif") {

                            var imageId = crypto.randomBytes(20).toString('hex');
                            var fileExtension;
                            switch (cover.mimetype) {
                                case "image/jpeg":
                                    fileExtension = ".jpeg";
                                    break;
                                case "image/png":
                                    fileExtension = ".png";
                                    break;
                                case "image/gif":
                                    fileExtension = ".gif";
                                    break;
                            }
                            cover.mv(__dirname + "/../../public/image/cover/" + imageId + fileExtension, function (err) {

                                if (err) {

                                    success = false;
                                }

                                //altes Cover löschen
                                if (newMovie.coverImg.length > 0
                                    && fs.existsSync(__dirname + "/../../public/image/cover/" + newMovie.coverImg)
                                    && newMovie.coverImg != data.coverImg) {

                                    fs.unlinkSync(__dirname + "/../../public/image/cover/" + newMovie.coverImg);
                                }

                                //Dateinamen speichern
                                newMovie.coverImg = imageId + fileExtension;

                                //Film speichern
                                found = false;
                                var _movieModel = new MovieModel();
                                for (var i in data.movies) {

                                    if (data.movies[i].id == newMovie.id) {

                                        data.movies[i] = newMovie;
                                        found = true;
                                        break;
                                    }
                                }
                                var id = _movieModel.updateMovieBox(data);

                                if (id.length < 10 || found == false) {

                                    success = false;
                                }

                                //zur Übersicht umleiten
                                res.redirect("/admin/manageMovieBoxMovies/" + data.id + "?editMovieInBoxSuccess=" + (success ? "1" : "0"));
                                return;
                            })
                        } else {

                            //zur Übersicht umleiten
                            res.redirect("/admin/manageMovieBoxMovies/" + data.id + "?editMovieInBoxSuccess=0");
                        }
                    } else {

                        //kein Cover Hochgeladen

                        //Film speichern
                        found = false;
                        var _movieModel = new MovieModel();
                        for (var i in data.movies) {

                            if (data.movies[i].id == newMovie.id) {

                                data.movies[i] = newMovie;
                                found = true;
                                break;
                            }
                        }
                        var id = _movieModel.updateMovieBox(data);

                        if (id.length < 10 || found == false) {

                            success = false;
                        }

                        //zur Übersicht umleiten
                        res.redirect("/admin/manageMovieBoxMovies/" + data.id + "?editMovieInBoxSuccess=" + (success ? "1" : "0"));
                        return;
                    }

                } else {

                    res.redirect("/admin/manageMovieBoxMovies/" + data.id + "?editMovieInBoxSuccess=0");
                }
            });
        });
    }
}