/**
 * Created by oliver on 26.05.17.
 *
 * Suchfunktion
 */

const MovieModel = require('../model/moviemodel');
const Handlebars = require('handlebars');
const Entities = require('html-entities').Html5Entities;
const entities = new Entities();
const numberFormat = require('../util/numberFormat');

module.exports = function(req, res) {

    //Filme
    var movieModel = new MovieModel();
    movieModel.listOnlyMovies(function(data) {

        var moviesCount = data.length;
        var sumDuration = 0;
        var sumPrice = 0;
        var sumRating = 0;
        for(var i in data) {

            var movie = data[i];
            sumDuration += movie.duration;
            sumPrice += movie.price;
            sumRating += movie.rating;
        }

        //Filmboxen
        var movieModel = new MovieModel();
        movieModel.listMovieBoxes(function(data) {

            var movieCountInBoxes = 0;
            for(var i in data) {

                var movieBox = data[i];
                sumPrice += movieBox.price;
                movieBox.movies.forEach(movie => {

                    sumDuration += movie.duration;
                    sumRating += movie.rating;
                    movieCountInBoxes++;
                });
            }

            var movieCount = movieCountInBoxes + moviesCount;
            var movieBoxCount = data.length;
            var avgDuration = sumDuration / movieCount;
            var avgPrice = sumPrice / movieCount;
            var avgRating = Math.ceil(sumRating / movieCount);

            //Template an Browser
            res.render('statistics', {
                movieCount: numberFormat(movieCount, 0, 3, '.', ','),
                movieBoxCount: numberFormat(movieBoxCount, 0, 3, '.', ','),
                sumDuration: formatDuration(sumDuration),
                avgDuration: formatDuration(avgDuration),
                sumPrice: numberFormat(sumPrice, 2, 3, '.', ','),
                avgPrice: numberFormat(avgPrice, 2, 3, '.', ','),
                avgRating: avgRating
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
            formatedDuration += ' ' + h + (h > 1 ? ' Stunden' : ' Stunde');
        }
    }
    return formatedDuration;
}