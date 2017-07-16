/**
 * Created by oliver on 13.07.17.
 *
 * Backup Controller
 */

const Handlebars = require('handlebars');
const config = require('../../config');
const numberFormat = require('../../util/numberFormat');
const BackupModel = require('../../model/backupmodel');
const moment = require('moment');

module.exports = function(req, res) {

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

        //Template an Browser
        res.render('admin/backuplist', {
            layout: 'adminlayout',
            backups: backups,
            success: success
        });
    });
}