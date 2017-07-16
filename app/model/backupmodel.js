/**
 * Created by oliver on 13.07.17.
 *
 * Backupverwaltung
 */

const fs = require('fs-extra');
const jsonfile = require('jsonfile');
const rimraf = require('rimraf');
const zipFolder = require('zip-folder');
const { spawn } = require('child_process');
const crypto = require('crypto');
const moment = require('moment');
const MovieModel = require('./moviemodel');
const Movie = require('./movie');
const MovieBox = require('./moviebox');

'use strict';

module.exports = class BackupModel {

    listBackups(callback) {

        const backupDir = __dirname + '/../backup/';

        //Dateien einlesen
        fs.readdir(backupDir, (err, files) => {

            var backups = [];
            var i = 0;
            files.forEach(file => {

                if(file.endsWith('.zip')) {

                    var date = moment(file.substr(7, 20), 'YYYY_MM_DD__HH_mm_ss');
                    backups[i] = {
                        id: crypto.randomBytes(5).toString('hex'),
                        filename: file,
                        size: fs.statSync(backupDir + file).size,
                        date: date.format('DD.MM.YYYY HH:mm:ss')
                    };
                    i++;
                }
            });
            callback(backups);
        });
    }

    /**
     * erstellt ein Backup der Daten und Cover Bilder
     *
     * @param callback
     */
    createBackup(callback) {

        //Temp Ordner erstellen
        const tmpDir = '/tmp/mbBackup/';
        const backupDir = __dirname + '/../backup/';
        if(!fs.existsSync(tmpDir)) {

            fs.mkdirSync(tmpDir);
        } else {

            callback(null);
            return;
        }

        //Cover Bilder speichern
        var imageDir = __dirname + '/../public/image/cover/';
        fs.readdir(imageDir, (err, files) => {

            if(!fs.existsSync(tmpDir + 'cover/')) {

                fs.mkdirSync(tmpDir + 'cover/');
            } else {

                callback(null);
                return;
            }

            files.forEach(file => {

                if(file.endsWith('.jpg') ||
                    file.endsWith('.jpeg') ||
                    file.endsWith('.png') ||
                    file.endsWith('.gif')) {

                    fs.copySync(imageDir + file, tmpDir + 'cover/' + file);
                }
            });

            //Filme als JSON Datei speichern
            let _movieModel = new MovieModel();
            _movieModel.listOnlyMovies(function (movies) {

                //Daten in Json Datei schreiben
                jsonfile.writeFileSync(tmpDir + 'movies.json', movies);

                //Filmboxen als JSON Datei speichern
                let _movieModel = new MovieModel();
                _movieModel.listMovieBoxes(function (movieBoxes) {

                    //Daten in Json Datei schreiben
                    jsonfile.writeFileSync(tmpDir + 'movieBoxes.json', movieBoxes);

                    //Tar Datei erstellen
                    var hash = crypto.randomBytes(5).toString('hex');
                    var filename = 'backup_' + moment().format('YYYY_MM_DD__HH_mm_ss') + '_' + hash + '.zip';

                    zipFolder(tmpDir, backupDir + filename, function(err) {
                        if(err) {

                            //Temp Ordner löschen
                            rimraf(tmpDir, function () {

                                //Dateinamen zurückgeben
                                callback(null);
                            });
                        } else {

                            //Temp Ordner löschen
                            rimraf(tmpDir, function () {

                                //Dateinamen zurückgeben
                                callback(filename);
                            });
                        }
                    });
                });
            });
        });
    }

    restoreBackup(filename, callback) {

        const file = __dirname + '/../backup/' + filename;
        const tmpDir = '/tmp/mbRestore/';
        const imageDir = __dirname + '/../public/image/cover/';

        //Tempdir erstellen
        if(!fs.existsSync(tmpDir)) {

            fs.mkdirSync(tmpDir);
        } else {

            callback(false);
            return;
        }

        //in Temp Ordner entpacken
        const ls = spawn('unzip', [file, '-d', tmpDir]);
        ls.on('close', function (code) {

            if(code == 0) {

                //OK

                //Cover wiederherstellen
                fs.readdir(tmpDir + 'cover/', (err, files) => {

                    files.forEach(file => {

                        if(file.endsWith('.jpg') ||
                            file.endsWith('.jpeg') ||
                            file.endsWith('.png') ||
                            file.endsWith('.gif')) {

                            if(!fs.existsSync(imageDir + file)) {

                                fs.copySync(tmpDir + 'cover/' + file, imageDir + file);
                            } else {

                                fs.unlinkSync(imageDir + file);
                                fs.copySync(tmpDir + 'cover/' + file, imageDir + file);
                            }
                        }
                    });

                    //Datenbank leeren
                    let _movieModel = new MovieModel();
                    _movieModel.deleteAll(function (success) {

                        if(success) {

                            //Filme wiederherstellen
                            jsonfile.readFile(tmpDir + 'movies.json', function (err, data) {

                                if(!err) {

                                    let _movieModel = new MovieModel();
                                    for(var i in data) {

                                        var json = data[i];
                                        var _movie = new Movie();
                                        _movie.id = json._id;
                                        _movie.title = json._title;
                                        _movie.subTitle = json._subTitle;
                                        _movie.description = json._description;
                                        _movie.coverImg = json._coverImg;
                                        _movie.year = json._year;
                                        _movie.disc = json._disc;
                                        _movie.price = json._price;
                                        _movie.duration = json._duration;
                                        _movie.fsk = json._fsk;
                                        _movie.genre = json._genre;
                                        _movie.rating = json._rating;
                                        _movie.registredDate = json._registredDate;
                                        _movieModel.addMovie(_movie);
                                    }

                                    //Filmboxen wiederherstellen
                                    jsonfile.readFile(tmpDir + 'movieBoxes.json', function (err, data) {

                                        if (!err) {

                                            let _movieModel = new MovieModel();
                                            for(var i in data) {

                                                var json = data[i];
                                                var _movieBox = new MovieBox();
                                                _movieBox.id = json._id;
                                                _movieBox.title = json._title;
                                                _movieBox.subTitle = json._subTitle;
                                                _movieBox.coverImg = json._coverImg;
                                                _movieBox.year = json._year;
                                                _movieBox.disc = json._disc;
                                                _movieBox.price = json._price;
                                                _movieBox.registredDate = json._registredDate;

                                                var movies = [];
                                                for(var j in json._movies) {

                                                    var json1 = json._movies[j];
                                                    var _movie = new Movie();
                                                    _movie.id = json1._id;
                                                    _movie.title = json1._title;
                                                    _movie.subTitle = json1._subTitle;
                                                    _movie.description = json1._description;
                                                    _movie.coverImg = json1._coverImg;
                                                    _movie.year = json1._year;
                                                    _movie.disc = json1._disc;
                                                    _movie.price = json1._price;
                                                    _movie.duration = json1._duration;
                                                    _movie.fsk = json1._fsk;
                                                    _movie.genre = json1._genre;
                                                    _movie.rating = json1._rating;
                                                    _movie.registredDate = json1._registredDate;
                                                    movies[j] = _movie;
                                                }

                                                _movieBox.movies = movies;
                                                _movieModel.addMovieBox(_movieBox);
                                            }

                                            //Tempordner löschen
                                            rimraf(tmpDir, function () {

                                                //Dateinamen zurückgeben
                                                callback(true);
                                            });
                                        } else {

                                            rimraf(tmpDir, function () {

                                                //Dateinamen zurückgeben
                                                callback(false);
                                            });
                                        }
                                    });
                                } else {

                                    rimraf(tmpDir, function () {

                                        //Dateinamen zurückgeben
                                        callback(false);
                                    });
                                }
                            });
                        } else {

                            rimraf(tmpDir, function () {

                                //Dateinamen zurückgeben
                                callback(false);
                            });
                        }
                    });
                });
            } else {

                //Fehler
                callback(false);
            }
        });
    }

    /**
     * lscht ein Backup
     *
     * @param filename
     * @param callback
     */
    deleteBackup(filename, callback) {

        const file = __dirname + '/../backup/' + filename;
        fs.unlink(file, function (err) {

            if(!err) {

                callback(true);
            } else {

                callback(false);
            }
        });
    }
}