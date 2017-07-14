/**
 * Created by oliver on 13.07.17.
 *
 * Backup löschen Controller
 */

const fs = require('fs');
const BackupModel = require('../../model/backupmodel');

module.exports = function(req, res) {

    const file = __dirname + '/../../backup/' + req.params.file;

    if(fs.existsSync(file)) {

        var backup = new BackupModel();
        backup.deleteBackup(req.params.file, function (success) {

            //Template an Browser
            res.render('admin/deletebackup', {
                layout: 'adminlayout',
                success: success
            });
        });
    } else {

        //Template an Browser
        res.render('admin/deletebackup', {
            layout: 'adminlayout',
            success: false
        });
    }
}