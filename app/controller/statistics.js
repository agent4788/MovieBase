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

    //Values
    var movieCount = 0;
    var movieBoxCount = 0;
    var totalDuration = 0;
    var avgDuration = 0;
    var totalPrice = 0;
    var avgPrice = 0;
    var avgRating = 0;

    var purchaseAtYear = {};
    var costAtYear = {};
    var avgCostAtYear = {};
    var firstYear = 2100;

    var genres = {};
    var rating = {};
    var discs = {};
    var fsk = {};

    //Filme
    var movieModel = new MovieModel();
    movieModel.listOnlyMovies(function(data) {

        movieCount = data.length;
        var sumPrice = 0;
        var sumRating = 0;
        for(var i in data) {

            var movie = data[i];
            totalDuration += movie.duration;
            totalPrice += movie.price;
            sumRating += movie.rating;

            let year = movie.registredDate.substr(0, 4);
            purchaseAtYear[year] != undefined ? purchaseAtYear[year] += 1 : purchaseAtYear[year] = 0;
            costAtYear[year] != undefined ? costAtYear[year] += movie.price : costAtYear[year] = 0;
            firstYear > year ? firstYear = year : 0;

            genres[movie.genre] != undefined ? genres[movie.genre] += 1 : genres[movie.genre] = 1;
            rating[movie.rating] != undefined ? rating[movie.rating] += 1 : rating[movie.rating] = 1;
            discs[movie.disc] != undefined ? discs[movie.disc] += 1 : discs[movie.disc] = 1;
            fsk[movie.fsk] != undefined ? fsk[movie.fsk] += 1 : fsk[movie.fsk] = 1;
        }

        //Filmboxen
        var movieModel = new MovieModel();
        movieModel.listMovieBoxes(function(data) {

            var movieCountInBoxes = 0;
            for(var i in data) {

                var movieBox = data[i];
                sumPrice += movieBox.price;
                movieBox.movies.forEach(movie => {

                    totalDuration += movie.duration;
                    sumRating += movie.rating;
                    movieCountInBoxes++;

                    genres[movie.genre] != undefined ? genres[movie.genre] += 1 : genres[movie.genre] = 1;
                    rating[movie.rating] != undefined ? rating[movie.rating] += 1 : rating[movie.rating] = 1;
                    discs[movie.disc] != undefined ? discs[movie.disc] += 1 : discs[movie.disc] = 1;
                    fsk[movie.fsk] != undefined ? fsk[movie.fsk] += 1 : fsk[movie.fsk] = 1;
                });

                let year = movieBox.registredDate.substr(0, 4);
                purchaseAtYear[year] != undefined ? purchaseAtYear[year] += movieBox.movies.length : purchaseAtYear[year] = 0;
                costAtYear[year] != undefined ? costAtYear[year] += movieBox.price : costAtYear[year] = 0;
                firstYear > year ? firstYear = year : 0;
            }

            let thisYear = 1900 + new Date().getYear();
            for(let i = firstYear; i <= thisYear; i++) {

                purchaseAtYear[i] == undefined ? purchaseAtYear[i] = 0 : 0;
                costAtYear[i] == undefined ? costAtYear[i] = 0 : 0;
            }

            Object.keys(purchaseAtYear).forEach(year => {

                if(purchaseAtYear[year] != undefined && costAtYear[year] != undefined && costAtYear[year] > 0) {

                    avgCostAtYear[year] = costAtYear[year] / purchaseAtYear[year];
                } else {

                    avgCostAtYear[year] = 0;
                }
            });

            genres = sortObject(genres);
            genres = sliceAndCombine(genres, 8);
            rating = sortObject(rating);
            discs = sortObject(discs);
            discs = sliceAndCombine(discs, 8);
            fsk = sortObject(fsk);
            fsk = sliceAndCombine(fsk, 8);

            movieCount = movieCountInBoxes + movieCount;
            movieBoxCount = data.length;
            avgDuration = totalDuration / movieCount;
            avgPrice = totalPrice / movieCount;
            avgRating = Math.ceil(sumRating / movieCount);

            //Template an Browser
            res.render('statistics', {
                movieCount: numberFormat(movieCount, 0, 3, '.', ','),
                movieBoxCount: numberFormat(movieBoxCount, 0, 3, '.', ','),
                sumDuration: formatDuration(totalDuration),
                avgDuration: formatDuration(avgDuration),
                sumPrice: numberFormat(totalPrice, 2, 3, '.', ','),
                avgPrice: numberFormat(avgPrice, 2, 3, '.', ','),
                avgRating: avgRating,
                purchaseAtYearKeys: Object.keys(purchaseAtYear).slice(-10, purchaseAtYear.length),
                purchaseAtYearData: Object.values(purchaseAtYear).slice(-10, purchaseAtYear.length),
                costAtYearKeys: Object.keys(costAtYear).slice(-10, costAtYear.length),
                costAtYearData: Object.values(costAtYear).slice(-10, costAtYear.length),
                avgCostAtYearKeys: Object.keys(avgCostAtYear).slice(-10, avgCostAtYear.length),
                avgCostAtYearData: Object.values(avgCostAtYear).slice(-10, avgCostAtYear.length),
                genresKeys: Object.keys(genres),
                genresData: Object.values(genres),
                ratingKeys: Object.keys(rating),
                ratingData: Object.values(rating),
                discsKeys: Object.keys(discs),
                discsData: Object.values(discs),
                fskKeys: Object.keys(fsk),
                fskData: Object.values(fsk)
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

function sortObject(obj) {

    let arr = [];
    for (let prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            arr.push({
                'key': prop,
                'value': obj[prop]
            });
        }
    }
    arr.sort(function(a, b) { return b.value - a.value; });
    //arr.sort(function(a, b) { a.value.toLowerCase().localeCompare(b.value.toLowerCase()); }); //use this to sort as strings
    let newObj = {};
    for(let i = 0; i < arr.length; i++) {

        newObj[arr[i].key] = arr[i].value;
    }
    return newObj; // returns array
}

function sliceAndCombine(object, maxLen) {

    maxLen = maxLen - 1;
    if(Object.keys(object).length > maxLen) {

        let newObject = {};
        let keys = Object.keys(object);
        for(let i in keys) {

            let key = keys[i];
            if(i < maxLen) {

                newObject[key] = object[key];
            } else {

                newObject['andere'] != undefined ? newObject['andere'] += object[key] : newObject['andere'] = object[key];
            }
        }
        return newObject;
    } else {

        return object;
    }
}