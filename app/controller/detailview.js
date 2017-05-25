/**
 * Created by oliver on 24.05.17.
 *
 * Film Detailansicht
 */

const MovieModel = require('../model/moviemodel');
const Movie = require('../model/movie');
const MovieBox = require('../model/moviebox');
const movieFormat = require('../util/movieFormat');

module.exports = function(req, res) {

    var movieModel = new MovieModel();
    movieModel.getMovieById(req.params.id, function(data) {

        var _movie, _moviebox, _movieboxfsk = 0, _movieboxduration = 0;
        var found = false;
        if(data instanceof Movie) {

            _movie = movieFormat(data);
            found = true;
        } else if(data instanceof MovieBox) {

            _moviebox = movieFormat(data);

            //FSK der Box ermitteln
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

            found = true;
        }

        //Template an Browser
        res.render('detailView', {movie: _movie, moviebox: _moviebox, movieboxfsk: _movieboxfsk, movieboxduration: formatedDuration, found: found});
    });
};

function formatDuration(duration) {

    var formatedDuration = '';
    if(duration < 60) {

        formatedDuration = duration + 'min';
    } else {

        formatedDuration = Math.floor(duration / 60) + 'h';

        if((duration % 60) > 0) {

            formatedDuration += ' ' + Math.ceil(duration % 60) + 'min';
        }
    }
    return formatedDuration;
}
