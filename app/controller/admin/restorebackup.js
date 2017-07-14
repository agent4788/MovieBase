/**
 * Created by oliver on 13.07.17.
 *
 * Backup wiederherstellen Controller
 */

const fs = require('fs');
const BackupModel = require('../../model/backupmodel');

module.exports = function(req, res) {

    const backupDir = __dirname + '/../../backup/';
    var file = backupDir + req.params.file;

    if(fs.existsSync(file)) {

        var backup = new BackupModel();
        backup.restoreBackup(req.params.file, function (success) {

            //Template an Browser
            res.render('admin/restorebackup', {
                layout: 'adminlayout',
                success: success
            });
        });
    } else {

        //Template an Browser
        res.render('admin/restorebackup', {
            layout: 'adminlayout',
            success: false
        });
    }
}