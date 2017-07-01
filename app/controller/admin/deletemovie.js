/**
 * Created by oliver on 31.05.17.
 *
 * Film löschen Controller
 */

const MovieModel = require('../../model/moviemodel');
const Movie = require('../../model/movie');
const fs = require('fs');

module.exports = function(req, res) {

    var movieModel = new MovieModel();
    movieModel.getMovieById(req.params.id, function(data) {

        //Formular anzeigen

        if (data instanceof Movie) {

            var movieModel = new MovieModel();
            movieModel.deleteMovie(data.id);

            //Cover löschen
            if(data.coverImg.length > 0) {

                fs.unlinkSync(__dirname + "/../../public/image/cover/" + data.coverImg);
            }

            //zur Übersicht umleiten
            res.redirect("/admin?deleteSuccess=1");
            return;
        }
        //zur Übersicht umleiten
        res.redirect("/admin?deleteSuccess=0");
    });
}