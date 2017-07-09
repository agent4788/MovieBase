/**
 * Created by oliver on 02.07.17.
 *
 * Filmboxen Liste Controller
 */

const MovieModel = require('../../model/moviemodel');
const MovieBox = require('../../model/moviebox');
const Movie = require('../../model/movie');
const Handlebars = require('handlebars');
const config = require('../../config');
const movieFormat = require('../../util/movieFormat');

module.exports = function(req, res) {

    var movieModel = new MovieModel();
    movieModel.getMovieBoxById(req.params.id, function(data) {

        //Formular anzeigen

        if (data instanceof MovieBox) {

            _moviebox = movieFormat(data);

            //FSK der Box ermitteln
            var _movieboxfsk = 0;
            var _movieboxduration = 0;
            var movies = _moviebox.movies;
            for(var i in _moviebox.movies) {

                var movie1 = _moviebox.movies[i];
                if(_movieboxfsk < movie1.fsk) {

                    _movieboxfsk = movie1.fsk;
                }
                //Laufzeit
                _movieboxduration += movie1.duration;
                _moviebox.movies[i].duration = formatDuration(_moviebox.movies[i].duration);
            }

            //Laufzeit formatieren
            var formatedDuration = formatDuration(_movieboxduration);

            //Meldungen verarbeiten


            //Meldungen
            var success = {
                add: false,
                addSuccess: false,
                edit: false,
                editSuccess: false,
                delete: false,
                deleteSuccess: false,
            };

            if(req.query.addSuccess !== undefined) {

                success.add = true;
                success.addSuccess = req.query.addSuccess;
            }

            if(req.query.editSuccess !== undefined) {

                success.edit = true;
                success.editSuccess = req.query.editSuccess;
            }

            if(req.query.addMovieToBoxSuccess !== undefined) {

                success.addMovieToBox = true;
                success.addMovieToBoxSuccess = req.query.addMovieToBoxSuccess;
            }

            if(req.query.editMovieInBoxSuccess !== undefined) {

                success.editMovieInBox = true;
                success.editMovieInBoxSuccess = req.query.editMovieInBoxSuccess;
            }

            if(req.query.deleteMovieFromBoxSuccess !== undefined) {

                success.deleteMovieFromBox = true;
                success.deleteMovieFromBoxSuccess = req.query.deleteMovieFromBoxSuccess;
            }

            //Template an Browser
            res.render('admin/maganemovieboxmovies', {
                layout: 'adminlayout',
                config: config,
                moviebox: _moviebox,
                movieboxfsk: _movieboxfsk,
                movieboxduration: formatedDuration,
                success: success
            });
        } else {

            res.redirect("/admin/boxes?manageSuccess=0");
        }
    });
}

function formatDuration(duration) {

    var formatedDuration = '';
    if(duration < 60) {

        formatedDuration = duration + 'min';
    } else {

        formatedDuration = Math.floor(duration / 60) + 'h';

        if((duration % 60) > 0) {

            var min = Math.ceil(duration % 60);
            formatedDuration += ' ' + (min < 10 ? '0' : '') + min + 'min';
        }
    }
    return formatedDuration;
}