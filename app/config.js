/**
 * Created by oliver on 19.05.17.
 *
 * Konfiguration
 */

module.exports = {

    database: {
        host:     '127.0.0.1',
        port:     6379,
        db:       10,
        password: ''
    },

    pagination: {
        elementsAtPage: 10          //Anzahl der Filme die pro Seite angezeigt werden
    },

    genres: [
        'Action',
        'Horror',
        'Drama',
        'Musik'
    ],

    fsk: [
        0, 6, 12, 16, 18
    ],

    disc: [
        "DVD",
        "Blu-ray",
        "UHD Blu-ray"
    ],

    dashboard: {
        newestMoviesValue: 25,      //Anzahl der neusten Filme aus der die Anzahl der angezeigten Filme entnommen wird
        newestMoviesShow : 5,       //Anzahl der neusten Filme die angezeigt werden sollen
        bestMoviesValue  : 50,      //Anzahl der Filme mit der besten Bewertung aus der die Anzahl der angezeigten Filme entnommen wird
        bestMoviesShow   : 5        //Anzahl der Filme mit der besten Bewertung die angezeigt werden sollen
    }
}
