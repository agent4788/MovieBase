/**
 * Created by oliver on 07.05.17.
 */

var express = require('express');
var fileUpload = require('express-fileupload');
var bodyParser = require('body-parser');
var exbars  = require('exbars');
var app = express();

//statische Dateien einbinden
app.use('/static', express.static(__dirname + '/public'));

//File Uploade initialisieren
app.use(fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 }
}));

//Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//Template Engine registrieren
app.engine('hbs', exbars({
    defaultLayout: 'main',
    viewsPath:     'app/views'
}));
app.set('views', 'app/views');
app.set('view engine', 'hbs');

//Routen
require('./routes/router')(app);

//Server starten
app.listen(3000, function () {
    console.log('Server unter http://localhost:3000 gestartet');
});
