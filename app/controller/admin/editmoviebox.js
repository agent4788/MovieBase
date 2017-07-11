/**
 * Created by oliver on 02.07.17.
 *
 * Filmbox bearbeiten Controller
 */

const MovieModel = require('../../model/moviemodel');
const MovieBox = require('../../model/moviebox');
const Handlebars = require('handlebars');
const config = require('../../config');
const crypto = require('crypto');
const movieFormat = require('../../util/movieFormat');
const fs = require('fs');
const datetime = require('node-datetime');

module.exports = {

    get: function (req, res) {

        var movieModel = new MovieModel();
        movieModel.getMovieBoxById(req.params.id, function(data) {

            //Formular anzeigen

            if(data instanceof MovieBox) {

                //Liste der Jahre
                var year = new Date().getYear() + 1900;
                var years = [];
                for(var i = year, j = 0; i >= 1900; i--, j++) {
                    years[j] = i;
                }

                //Template an Browser
                res.render('admin/editmoviebox', {layout: 'adminlayout', config: config, years: years, moviebox: data});
            } else {

                res.redirect("/admin/boxes?editSuccess=0");
            }
        });
    },
    post: function (req, res) {

        var movieModel = new MovieModel();
        movieModel.getMovieBoxById(req.params.id, function(data) {

            //Formular anzeigen

            if (data instanceof MovieBox) {

                //Formulardaten verarbeiten
                var title = req.body.title;
                var subTitle = req.body.subtitle;
                var cover = req.files.cover;
                var year = parseInt(req.body.year);
                var disc = req.body.disc;
                var price = parseFloat(req.body.price);
                var purchaseDate = req.body.purchaseDate;

                //Film
                var newMovieBox = data;
                var success = true;

                //Titel
                if (title.length > 0 && title.length <= 100) {

                    newMovieBox.title = title;
                } else {

                    success = false;
                }

                //Untertitel
                if (subTitle.length >= 0 && subTitle.length <= 100) {

                    newMovieBox.subTitle = subTitle;
                } else {

                    success = false;
                }

                //Produktionsjahr
                if (year >= 1900 && year <= (new Date().getYear() + 1900)) {

                    newMovieBox.year = year;
                } else {

                    success = false;
                }

                //Medium
                if (config.disc.indexOf(disc) >= 0) {

                    newMovieBox.disc = disc;
                } else {

                    success = false;
                }

                //Preis
                if (price >= 0 && price <= 1000) {

                    newMovieBox.price = price;
                } else {

                    success = false;
                }

                //Kaufdatum
                if(purchaseDate.match(/^\d{4}-\d{2}-\d{2}$/)) {

                    newMovieBox.registredDate = purchaseDate;
                    for(var i in newMovieBox.movies) {

                        newMovieBox.movies[i].registredDate = purchaseDate;
                    }
                } else {

                    success = false;
                }

                if (success == false) {

                    //zur Übersicht umleiten
                    res.redirect("/admin/boxes?addSuccess=0");
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
                            if(newMovieBox.coverImg.length > 0) {

                                fs.unlinkSync(__dirname + "/../../public/image/cover/" + newMovieBox.coverImg);
                            }

                            //Dateinamen speichern
                            newMovieBox.coverImg = imageId + fileExtension;

                            //Film speichern
                            var _movieModel = new MovieModel();
                            var id = _movieModel.updateMovieBox(newMovieBox);

                            if (id.length < 10) {

                                success = false;
                            }

                            //zur Übersicht umleiten
                            if(success) {

                                res.redirect("/admin/manageMovieBoxMovies/" + id + "?editSuccess=1");
                            } else {

                                res.redirect("/admin/boxes?editSuccess=0");
                            }
                            return;
                        })
                    } else {

                        //zur Übersicht umleiten
                        res.redirect("/admin/boxes?addSuccess=0");
                    }
                } else {

                    //kein Cover Hochgeladen

                    //Film speichern
                    var _movieModel = new MovieModel();
                    var id = _movieModel.updateMovieBox(newMovieBox);

                    if (id.length < 10) {

                        success = false;
                    }

                    //zur Übersicht umleiten
                    if(success) {

                        res.redirect("/admin/manageMovieBoxMovies/" + id + "?editSuccess=1");
                    } else {

                        res.redirect("/admin/boxes?editSuccess=0");
                    }
                    return;
                }
            } else {

                //zur Übersicht umleiten
                res.redirect("/admin/boxes?addSuccess=0");
            }
        });
    }

}