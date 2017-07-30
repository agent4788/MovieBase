/**
 * Created by oliver on 24.05.17.
 *
 * Filmbewertung aktualisieren
 */

const MovieModel = require('../model/moviemodel');
const Movie = require('../model/movie');
const MovieBox = require('../model/moviebox');
const movieFormat = require('../util/movieFormat');

module.exports = function(req, res) {

    var movieModel = new MovieModel();
    movieModel.getMovieById(req.params.id, function(data) {

        var newRating = parseInt(req.params.newRating);
        if(newRating >= 1 && newRating <= 5) {

            if(data instanceof Movie) {

                //Film
                data.rating = newRating;
                var movieModel = new MovieModel();
                movieModel.updateMovie(data);
                res.end('1');

            } else if(data instanceof MovieBox) {

                //Filmbox
                var movies = [];
                for(var i in data.movies) {

                    movies[i] = data.movies[i];
                    if(movies[i].id == req.params.id) {

                        movies[i].rating = newRating;
                    }
                }
                data.movies = movies;
                var movieModel = new MovieModel();
                movieModel.updateMovieBox(data);
                res.end('1');

            } else {

                res.end('0');
            }
        } else {

            res.end('0');
        }
    });
};