/**
 * Created by oliver on 13.07.17.
 *
 * Backup Controller
 */

const Handlebars = require('handlebars');
const numberFormat = require('../../util/numberFormat');
const BackupModel = require('../../model/backupmodel');
const moment = require('moment');
const { spawn } = require('child_process');
const fs = require('fs');
const rimraf = require('rimraf');
const crypto = require('crypto');

module.exports = {

    get: function(req, res) {

        var backup = new BackupModel();
        backup.listBackups(function (backups) {

            //Daten nach Datum sortieren
            backups.sort(function(obj1, obj2) {

                if(moment(obj1.date, 'YYYY_MM_DD__HH_mm_ss').isBefore(moment(obj2.date, 'YYYY_MM_DD__HH_mm_ss'))) {

                    return 1;
                } else if(moment(obj1.date).isSame(moment(obj2.date, 'YYYY_MM_DD__HH_mm_ss'))) {

                    return 0;
                } else if(moment(obj1.date).isAfter(moment(obj2.date, 'YYYY_MM_DD__HH_mm_ss'))) {

                    return -1;
                }
            });

            backups.forEach(backup => {

                backup.size = numberFormat((backup.size / 1024 / 1024), 2, 3, '.', ',') + " MiB";
            });

            //Meldungen
            var success = {
                download: false,
                downloadSuccess: false
            };

            if(req.query.downloadSuccess !== undefined) {

                success.download = true;
                success.downloadSuccess = parseInt(req.query.downloadSuccess);
            }

            if(req.query.upload !== undefined) {

                success.upload = true;
                success.uploadTrue = (parseInt(req.query.upload) == 1 ? true : false);
                success.uploadFalse = (parseInt(req.query.upload) == 0 ? true : false);
                success.uploadExists = (parseInt(req.query.upload) == 2 ? true : false);
            }

            //Template an Browser
            res.render('admin/backuplist', {
                layout: 'adminlayout',
                backups: backups,
                success: success
            });
        });
    },

    post: function (req, res) {

        if(req.files.backupFile) {

            var backupFile = req.files.backupFile;
            if(backupFile.mimetype == 'application/zip') {

                //Prüfen ob Backupdatei schon existiert
                var file = __dirname + "/../../backup/" + backupFile.name;
                if(!fs.existsSync(file)) {

                    backupFile.mv(__dirname + "/../../backup/" + backupFile.name, function (err) {

                        const tmpDir = '/tmp/mbCheckup/';

                        //Tempdir erstellen
                        if(!fs.existsSync(tmpDir)) {

                            fs.mkdirSync(tmpDir);
                        } else {

                            res.redirect('/admin/backups?upload=0');
                            return;
                        }

                        //in Temp Ordner entpacken
                        const ls = spawn('unzip', [file, '-d', tmpDir]);
                        ls.on('close', function (code) {

                            if (code == 0) {

                                if (fs.existsSync(tmpDir + 'movies.json')
                                    && fs.existsSync(tmpDir + 'movieBoxes.json')
                                    && fs.existsSync(tmpDir + 'settings.json')) {

                                    //Upload erfolgreich
                                    //Tempordner löschen
                                    rimraf(tmpDir, function () {

                                        console.log(true);
                                        res.redirect('/admin/backups?upload=1');
                                        return;
                                    });
                                } else {

                                    //Fehlerhafte Datei
                                    rimraf(tmpDir, function () {

                                        res.redirect('/admin/backups?upload=0');
                                        return;
                                    });
                                }
                            }
                        });
                    });

                } else {

                    //Backup Datei existiert bereits
                    res.redirect('/admin/backups?upload=2');
                    return;
                }
            }
        }
    }
}