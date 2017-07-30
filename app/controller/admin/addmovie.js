/**
 * Created by oliver on 24.06.17.
 *
 * Admin Controller
 */

const MovieModel = require('../../model/moviemodel');
const SettingsModel = require('../../model/settingsmodel');
const Movie = require('../../model/movie');
const Handlebars = require('handlebars');
const crypto = require('crypto');
const movieFormat = require('../../util/movieFormat');
const moment = require('moment');

module.exports = {
    
    get: function(req, res) {

        var _settingsModel = new SettingsModel();
        _settingsModel.getSettings(function (settings) {

            //Formular anzeigen

            //Liste der Jahre
            var year = new Date().getYear() + 1900;
            var years = [];
            for(var i = year, j = 0; i >= 1900; i--, j++) {
                years[j] = i;
            }

            //aktuelles Datum
            var dt = moment();
            var today = dt.format('YYYY-MM-DD');

            //Template an Browser
            res.render('admin/addmovie', {layout: 'adminlayout', config: settings, years: years, today: today});
        });
    },
    post: function (req, res) {

        var _settingsModel = new SettingsModel();
        _settingsModel.getSettings(function (settings) {

            //Formulardaten verarbeiten
            var title = req.body.title;
            var subTitle = req.body.subtitle;
            var description = req.body.description;
            var cover = req.files.cover;
            var year = parseInt(req.body.year);
            var disc = req.body.disc;
            var price = parseFloat(req.body.price);
            var duration = parseInt(req.body.duration);
            var fsk = parseInt(req.body.fsk);
            var genre = req.body.genre;
            var rating = parseInt(req.body.rating);
            var purchaseDate = req.body.purchaseDate;
            var directors = req.body.directors;
            var actors = req.body.actors;

            //Film
            var newMovie = new Movie();
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
            if (description.length <= 10000) {

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

            //Preis
            if (price >= 0 && price <= 1000) {

                newMovie.price = price;
            } else {

                success = false;
            }

            //Laufzeit
            if (duration >= 0 && duration <= 1000) {

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

            //Kaufdatum
            if (purchaseDate.match(/^\d{4}-\d{2}-\d{2}$/)) {

                newMovie.registredDate = purchaseDate;
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
                res.redirect("/admin?addSuccess=0");
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

                        //Dateinamen speichern
                        newMovie.coverImg = imageId + fileExtension;

                        //Film speichern
                        var _movieModel = new MovieModel();
                        var id = _movieModel.addMovie(newMovie);

                        if (id.length < 10) {

                            success = false;
                        }

                        //zur Übersicht umleiten
                        res.redirect("/admin?addSuccess=" + (success ? "1" : "0") + "&id=" + id);
                        return;
                    })
                } else {

                    //zur Übersicht umleiten
                    res.redirect("/admin?addSuccess=0");
                }
            } else {

                //kein Cover Hochgeladen

                //Film speichern
                var _movieModel = new MovieModel();
                var id = _movieModel.addMovie(newMovie);

                if (id.length < 10) {

                    success = false;
                }

                //zur Übersicht umleiten
                res.redirect("/admin?addSuccess=" + (success ? "1" : "0") + "&id=" + id);
                return;
            }
        });
    }
}