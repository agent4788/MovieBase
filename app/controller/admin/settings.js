/**
 * Created by oliver on 24.06.17.
 *
 * Admin Controller
 */

const Handlebars = require('handlebars');
const config = require('../../config');;
const SettingsModel = require('../../model/settingsmodel');

module.exports =  {

    get: function(req, res) {

        var _settingsModel = new SettingsModel();
        _settingsModel.getSettings(function(settings) {

            settings.genres = implode(settings.genres);
            settings.disc = implode(settings.disc);
            settings.directors = implode(settings.directors);
            settings.actors = implode(settings.actors);

            //Template an Browser
            res.render('admin/settings', {
                layout: 'adminlayout',
                settings: settings
            });
        });
    },
    post: function(req, res) {

        var newestMoviesValue = parseInt(req.body.newestMoviesValue);
        var newestMoviesShow = parseInt(req.body.newestMoviesShow);
        var bestMoviesValue = parseInt(req.body.bestMoviesValue);
        var bestMoviesShow = parseInt(req.body.bestMoviesShow);
        var cacheTime = parseInt(req.body.cacheTime);
        var elementsAtPage = parseInt(req.body.elementsAtPage);
        var genres = req.body.genres.trim();
        var disc = req.body.disc.trim();
        var directors = req.body.directors.trim();
        var actors = req.body.actors.trim();

        //Daten prüfen
        var success = true;
        if(!(newestMoviesValue >= 1 && newestMoviesValue <= 100000)) {

            success = false;
        }
        if(!(newestMoviesShow >= 1 && newestMoviesShow <= 100000)) {

            success = false;
        }
        if(!(bestMoviesValue >= 1 && bestMoviesValue <= 100000)) {

            success = false;
        }
        if(!(bestMoviesShow >= 1 && bestMoviesShow <= 100000)) {

            success = false;
        }
        if(!(cacheTime >= 1 && cacheTime <= 100000)) {

            success = false;
        }
        if(!(elementsAtPage >= 1 && elementsAtPage <= 100000)) {

            success = false;
        }
        var genresArray = explode(genres);
        if(!(genresArray.length > 0)) {success = false;}
        var discArray = explode(disc);
        if(!(discArray.length > 0)) {success = false;}
        var directorsArray = explode(directors);
        if(!(directorsArray.length > 0)) {success = false;}
        var actorsArray = explode(actors);
        if(!(actorsArray.length > 0)) {success = false;}

        //Zum Einstellungsobjekt zusammenfassen
        var settingsData = {
            pagination: {
                elementsAtPage: elementsAtPage
            },
            genres: sort(genresArray),
            fsk: config.fsk,
            disc: discArray,
            directors: sort(directorsArray),
            actors: sort(actorsArray),
            dashboard: {
                newestMoviesValue: newestMoviesValue,
                newestMoviesShow : newestMoviesShow,
                bestMoviesValue  : bestMoviesValue,
                bestMoviesShow   : bestMoviesShow,
                cacheTime        : cacheTime
            }
        };

        //Einstellungen speichern
        var _settingsModel = new SettingsModel();
        _settingsModel.updateSettings(settingsData);

        settingsData.genres = implode(settingsData.genres);
        settingsData.disc = implode(settingsData.disc);
        settingsData.directors = implode(settingsData.directors);
        settingsData.actors = implode(settingsData.actors);

        //Template an Browser
        res.render('admin/settings', {
            layout: 'adminlayout',
            settings: settingsData,
            success: 1,
            successData: success
        });
    }
};

function implode(array) {

    var str = '';
    array.forEach((element) => {

        str += element + "\n";
    });
    return str;
}

function explode(string) {

    return string.split(/(?:\r\n|\r|\n)/g);
}

function sort(data) {

    data.sort(function(obj1, obj2) {

        as = obj1;
        bs = obj2;
        var a, b, a1, b1, rx=/(\d+)|(\D+)/g, rd=/\d+/;
        a= String(as).toLowerCase().match(rx);
        b= String(bs).toLowerCase().match(rx);
        while(a.length && b.length){
            a1= a.shift();
            b1= b.shift();
            if(rd.test(a1) || rd.test(b1)){
                if(!rd.test(a1)) return 1;
                if(!rd.test(b1)) return -1;
                if(a1!= b1) return a1-b1;
            }
            else if(a1!= b1) return a1> b1? 1: -1;
        }
        return a.length- b.length;
    });
    return data;
}