/**
 * Created by oliver on 13.07.17.
 *
 * Backup erstellen Controller
 */

const BackupModel = require('../../model/backupmodel');
const config = require('../../config');

module.exports = function(req, res) {

    var backup = new BackupModel();
    backup.createBackup(function(filename) {

        var success = false;
        if(filename != null) {

            success = true;
        }

        //Template an Browser
        res.render('admin/createbackup', {
            layout: 'adminlayout',
            success: success
        });
    });
}