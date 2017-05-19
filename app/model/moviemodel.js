/**
 * Created by oliver on 19.05.17.
 *
 * Datenverwaltung
 */

'use strict';

const Movie = require('./movie');
const MovieBox = require('./moviebox');

var redis = require('redis');
const config = require('../config');

module.exports = class MovieModel {

    /**
     * Datenbankverbindung herstellen
     *
     * @private
     */
    __connect() {

        var dbConfig = {
            host: config.database.host,
            port: config.database.port,
            db: config.database.db
        };
        if(config.database.password.length > 0) {
            dbConfig.password = config.database.password;
        }
        return redis.createClient(dbConfig);
    }


}