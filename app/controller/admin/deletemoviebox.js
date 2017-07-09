/**
 * Created by oliver on 02.07.17.
 *
 * Filmbox löschen Controller
 */

const MovieModel = require('../../model/moviemodel');
const MovieBox = require('../../model/moviebox');
const fs = require('fs');

module.exports = function(req, res) {

    var movieModel = new MovieModel();
    movieModel.getMovieBoxById(req.params.id, function(data) {

        //Formular anzeigen

        if (data instanceof MovieBox) {

            var movieModel = new MovieModel();
            movieModel.deleteMovieBox(data.id);

            //Cover löschen
            if(data.coverImg.length > 0) {

                fs.unlinkSync(__dirname + "/../../public/image/cover/" + data.coverImg);
            }

            //zur Übersicht umleiten
            res.redirect("/admin/boxes?deleteSuccess=1");
            return;
        }
        //zur Übersicht umleiten
        res.redirect("/admin/boxes?deleteSuccess=0");
    });
}