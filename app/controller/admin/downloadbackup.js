/**
 * Created by oliver on 13.07.17.
 *
 * Download Backup Controller
 */

const path = require('path');
const mime = require('mime');
const fs = require('fs');

module.exports = function(req, res) {

    const backupDir = __dirname + '/../../backup/';
    var file = backupDir + req.params.file;

    if(fs.existsSync(file)) {

        var filename = path.basename(file);
        var mimetype = mime.lookup(file);

        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
        res.setHeader('Content-type', mimetype);

        var filestream = fs.createReadStream(file);
        filestream.pipe(res);
    } else {

        res.redirect('/admin/backups?downloadSuccess=0');
    }
}