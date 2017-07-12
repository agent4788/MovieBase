/**
 * Created by oliver on 26.05.17.
 *
 * Suchfunktion
 */

const MovieModel = require('../model/moviemodel');
const Handlebars = require('handlebars');
const config = require('../config');
const Entities = require('html-entities').Html5Entities;
const entities = new Entities();
const numberFormat = require('../util/numberFormat');

module.exports = function(req, res) {

    //Filme
    var movieModel = new MovieModel();
    movieModel.listMovies(function(data) {

        var sumDuration = 0;
        var sumPrice = 0;
        var sumRating = 0;
        for(var i in data) {

            var movie = data[i];
            sumDuration += movie.duration;
            sumPrice += movie.price;
            sumRating += movie.rating;
        }

        var movieCount = data.length;
        var avgDuration = sumDuration / movieCount;
        var avgPrice = sumPrice / movieCount;
        var avgRating = Math.ceil(sumRating / movieCount);

        //Bewertung formatieren
        var rating = '';
        for(var i = 0; i < avgRating; i++) {

            rating += '<i class="yellow star icon"></i>';
        }
        for(var i = 0; i < (5 - avgRating); i++) {

            rating += '<i class="grey star icon"></i>';
        }

        //Filmboxen
        var movieModel = new MovieModel();
        movieModel.listMovieBoxes(function(data) {

            var movieBoxCount = data.length;

            //Template an Browser
            res.render('statistics', {
                movieCount: numberFormat(movieCount, 0, 3, '.', ','),
                movieBoxCount: numberFormat(movieBoxCount, 0, 3, '.', ','),
                sumDuration: formatDuration(sumDuration),
                avgDuration: formatDuration(avgDuration),
                sumPrice: numberFormat(sumPrice, 2, 3, '.', ','),
                avgPrice: numberFormat(avgPrice, 2, 3, '.', ','),
                avgRating: new Handlebars.SafeString(rating)
            });
        });
    });
}

function formatDuration(duration) {

    var formatedDuration = '';
    if(duration < 60) {

        formatedDuration = duration + (duration > 1 ? ' Minuten' : ' Minute');
    } else if(duration < (24 * 60)) {

        var h = Math.floor(duration / 60);
        formatedDuration =  h + (h > 1 ? ' Stunden' : ' Stunde');

        if((duration % 60) > 0) {

            var min = Math.ceil(duration % 60);
            formatedDuration += ' ' + (min < 10 ? '0' : '') + min + (min > 1 ? ' Minuten' : ' Minute');
        }
    } else {

        var t = Math.floor(duration / (60 * 24));
        formatedDuration =  t + (t > 1 ? ' Tage' : ' Tag');

        if((duration - (t * 24 * 60)) >= 60) {

            var h = Math.ceil((duration - (t * 24 * 60)) / 60);
            formatedDuration += ' ' + (h < 10 ? '0' : '') + h + (h > 1 ? ' Stunden' : ' Stunde');
        }
    }
    return formatedDuration;
}