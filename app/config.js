/**
 * Created by oliver on 19.05.17.
 *
 * Konfiguration
 */

module.exports = {

    database: {     //Redis Verbindungsdaten
        host:     '127.0.0.1',
        port:     6379,
        db:       10,
        password: ''
    },

    server: {
        port: 8080                  //Server Port
    },

    pagination: {
        elementsAtPage: 10          //Anzahl der Filme die pro Seite angezeigt werden
    },

    genres: [   //Genres
        'Action',
        'Comedy',
        'Dokumentation',
        'Drama',
        'Fantasy',
        'Horror',
        'Kriegsfilm',
        'Mafia',
        'Si-Fi',
        'Thriller',
        'Western',
        'Zeichentrick',
        'Musik',
        'Serien'
    ],

    fsk: [      //Altersfreigaben
        0, 6, 12, 16, 18
    ],

    disc: [     //Medienformate
        "DVD",
        "Blu-ray",
        "3D Blu-ray",
        "4K Blu-ray",
        "SD Datei",
        "HD Datei",
        "4K Datei"
    ],

    directors: [ //Regisseure

    ],

    actors: [    //Schauspieler

    ],

    dashboard: {
        newestMoviesValue: 50,      //Anzahl der neusten Filme aus der die Anzahl der angezeigten Filme entnommen wird
        newestMoviesShow : 5,       //Anzahl der neusten Filme die angezeigt werden sollen
        bestMoviesValue  : 50,      //Anzahl der Filme mit der besten Bewertung aus der die Anzahl der angezeigten Filme entnommen wird
        bestMoviesShow   : 5,       //Anzahl der Filme mit der besten Bewertung die angezeigt werden sollen
        cacheTime        : 3600     //Lebensdauer der Dashboard Cachedaten in Sekunden
    }
}
