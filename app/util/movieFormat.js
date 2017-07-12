/**
 * Created by oliver on 25.05.17.
 *
 * Fomrmatiert einen Film zur Anzeige
 */

const Movie = require('../model/movie');
const MovieBox = require('../model/moviebox');
const Handlebars = require('handlebars');
const moment = require('moment');

function movieFormat(data, inBox = false) {

    if(data instanceof Movie) {

        //Film
        var _movie;
        _movie = new Movie();
        _movie.id = data.id;
        _movie.title = data.title;
        _movie.subTitle = data.subTitle;
        _movie.description = data.description;
        _movie.disc = data.disc;
        _movie.year = data.year;
        _movie.fsk = data.fsk;
        _movie.genre = data.genre;

        //Cover Bild
        if(data.coverImg.length > 0) {

            _movie.coverImg = data.coverImg;
        } else {

            _movie.coverImg = 'noimage.gif';
        }

        //Länge
        if(inBox == false) {

            if(data.duration < 60) {

                _movie.duration = data.duration + 'min';
            } else {

                _movie.duration = Math.floor(data.duration / 60) + 'h';
                if((data.duration % 60) > 0) {

                    var min = Math.ceil(data.duration % 60);
                    _movie.duration += ' ' + (min < 10 ? '0' : '') + min + 'min';
                }
            }
        } else {

            _movie.duration = data.duration;
        }

        //Preis
        _movie.price = parseFloat(data.price).toFixed(2).replace('.', ',');

        //Bewertung
        var rating = '';
        for(var i = 0; i < data.rating; i++) {

            rating += '<i class="yellow star icon"></i>';
        }
        for(var i = 0; i < (5 - data.rating); i++) {

            rating += '<i class="grey star icon"></i>';
        }
        _movie.rating = new Handlebars.SafeString(rating);

        //Kaufdatum
        _movie.registredDate = moment(_movie.registredDate).format('DD.MM.YYYY');

        return _movie;
    } else if(data instanceof MovieBox) {

        //Filmbox
        var _movieBox;
        _movieBox = new MovieBox();
        _movieBox.id = data.id;
        _movieBox.title = data.title;
        _movieBox.subTitle = data.subTitle;
        _movieBox.disc = data.disc;
        _movieBox.year = data.year;

        //Cover Bild
        if(data.coverImg.length > 0) {

            _movieBox.coverImg = data.coverImg;
        } else {

            _movieBox.coverImg = 'noimage.gif';
        }

        //Preis
        _movieBox.price = parseFloat(data.price).toFixed(2).replace('.', ',');

        //Kaufdatum
        _movieBox.registredDate = moment(_movieBox.registredDate).format('DD.MM.YYYY');

        //Filme formatieren
        var movies = [];
        for(var n = 0; n < data.movies.length; n++) {

            var movie1 = data.movies[n];
            movies[n] = movieFormat(movie1, true);
        }
        _movieBox.movies = movies;

        return _movieBox;
    }
}

module.exports = movieFormat;
