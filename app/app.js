/**
 * Created by oliver on 07.05.17.
 */

var express = require('express');
var exbars  = require('exbars');
var app = express();

//statische Dateien einbinden
app.use('/static', express.static(__dirname + '/public'));

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
