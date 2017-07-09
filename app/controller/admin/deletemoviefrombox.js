/**
 * Created by oliver on 31.05.17.
 *
 * Film löschen Controller
 */

const MovieModel = require('../../model/moviemodel');
const Movie = require('../../model/movie');
const MovieBox = require('../../model/moviebox');
const fs = require('fs');

module.exports = function(req, res) {

    var movieModel = new MovieModel();
    movieModel.getMovieById(req.params.id, function(data) {

        if (data instanceof MovieBox) {

            var movieModel = new MovieModel();
            var found = false;
            var _movie = null;
            var movies = [];
            var index = 0;
            for(var i in data.movies) {

                if(data.movies[i].id != req.params.id) {

                    movies[index] = data.movies[i];
                    index++;
                } else {

                    _movie = data.movies[i];
                    found = true;
                }
            }
            data.movies = movies;
            movieModel.updateMovieBox(data);

            //Cover löschen
            if(_movie != null && data.coverImg.length > 0) {

                fs.unlinkSync(__dirname + "/../../public/image/cover/" + data.coverImg);
            }

            //zur Übersicht umleiten
            res.redirect("/admin/manageMovieBoxMovies/" + data.id + "?deleteMovieFromBoxSuccess=" + (found ? "1" : "0"));
            return;
        }
        //zur Übersicht umleiten
        res.redirect("/admin/manageMovieBoxMovies/" + data.id + "?deleteMovieFromBoxSuccess=0");
    });
}