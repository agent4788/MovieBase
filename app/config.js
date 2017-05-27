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
        elementsAtPage: 10
    },

    genres: [
        'Action',
        'Horror',
        'Drama',
        'Musik'
    ],

    fsk: [
        0, 6, 12, 16, 18
    ]
}
