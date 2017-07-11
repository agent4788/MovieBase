/**
 * Created by oliver on 02.07.17.
 *
 * Filmbox hinzufügen Controller
 */

const MovieModel = require('../../model/moviemodel');
const MovieBox = require('../../model/moviebox');
const Handlebars = require('handlebars');
const config = require('../../config');
const crypto = require('crypto');
const movieFormat = require('../../util/movieFormat');
const datetime = require('node-datetime');

module.exports = {

    get: function (req, res) {

        //Formular anzeigen

        //Liste der Jahre
        var year = new Date().getYear() + 1900;
        var years = [];
        for(var i = year, j = 0; i >= 1900; i--, j++) {
            years[j] = i;
        }

        //aktuelles Datum
        var dt = datetime.create();
        var today = dt.format('Y-m-d');

        //Template an Browser
        res.render('admin/addmoviebox', {layout: 'adminlayout', config: config, years: years, today: today});
    },
    post: function (req, res) {

        //Formulardaten verarbeiten
        var title = req.body.title;
        var subTitle = req.body.subtitle;
        var cover = req.files.cover;
        var year = parseInt(req.body.year);
        var disc = req.body.disc;
        var price = parseFloat(req.body.price);
        var purchaseDate = req.body.purchaseDate;

        //Film
        var newMovieBox = new MovieBox();
        var success = true;

        //Titel
        if(title.length > 0 && title.length <= 100) {

            newMovieBox.title = title;
        } else {

            success = false;
        }

        //Untertitel
        if(subTitle.length >= 0 && subTitle.length <= 100) {

            newMovieBox.subTitle = subTitle;
        } else {

            success = false;
        }

        //Produktionsjahr
        if(year >= 1900 && year <= (new Date().getYear() + 1900)) {

            newMovieBox.year = year;
        } else {

            success = false;
        }

        //Medium
        if(config.disc.indexOf(disc) >= 0) {

            newMovieBox.disc = disc;
        } else {

            success = false;
        }

        //Preis
        if(price >= 0 && price <= 1000) {

            newMovieBox.price = price;
        } else {

            success = false;
        }

        //Kaufdatum
        if(purchaseDate.match(/^\d{4}-\d{2}-\d{2}$/)) {

            newMovieBox.registredDate = purchaseDate;
        } else {

            success = false;
        }

        if(success == false) {

            //zur Übersicht umleiten
            res.redirect("/admin/boxes?addSuccess=0");
        }

        //Cover (optional)
        if(cover != null) {

            //Cover hochgeladen
            if(cover.mimetype == "image/jpeg"
                || cover.mimetype == "image/png"
                || cover.mimetype == "image/gif") {

                var imageId = crypto.randomBytes(20).toString('hex');
                var fileExtension;
                switch(cover.mimetype) {
                    case "image/jpeg": fileExtension = ".jpeg"; break;
                    case "image/png": fileExtension = ".png"; break;
                    case "image/gif": fileExtension = ".gif"; break;
                }
                cover.mv(__dirname + "/../../public/image/cover/" + imageId + fileExtension, function (err) {

                    if(err) {

                        success = false;
                    }

                    //Dateinamen speichern
                    newMovieBox.coverImg = imageId + fileExtension;

                    //Film speichern
                    var _movieModel = new MovieModel();
                    var id = _movieModel.addMovieBox(newMovieBox);

                    if(id.length < 10) {

                        success = false;
                    }

                    //zur Übersicht umleiten
                    if(success) {

                        res.redirect("/admin/manageMovieBoxMovies/" + id + "?addSuccess=1");
                    } else {

                        res.redirect("/admin/boxes?addSuccess=0");
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
            var id = _movieModel.addMovieBox(newMovieBox);

            if(id.length < 10) {

                success = false;
            }

            //zur Übersicht umleiten
            if(success) {

                res.redirect("/admin/manageMovieBoxMovies/" + id + "?addSuccess=1");
            } else {

                res.redirect("/admin/boxes?addSuccess=0");
            }
            return;
        }
    }

}

