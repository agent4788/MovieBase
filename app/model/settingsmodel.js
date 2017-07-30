/**
 * Created by oliver on 19.05.17.
 *
 * Datenverwaltung
 */

'use strict';

const jsonfile = require('jsonfile');
const fs = require('fs');
const redis = require('redis');
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

    /**
     * gibt die Einstellungen zurück
     *
     * @param callback
     */
    getSettings(callback) {

        var client = this.__connect();
        var settingsModel = this;
        client.get('settings', function (err, data) {

            if(data) {

                callback(JSON.parse(data));
            } else {

                var settingsData = {
                    pagination: config.pagination,
                    genres: config.genres,
                    fsk: config.fsk,
                    disc: config.disc,
                    directors: config.directors,
                    actors: config.actors,
                    dashboard: config.dashboard
                };

                settingsModel.updateSettings(settingsData);
                callback(settingsData);
            }
            client.quit();
        });
    }

    /**
     * speichert die Einstellungen
     *
     * @param settings
     */
    updateSettings(settings) {

        var client = this.__connect();
        client.set('settings', JSON.stringify(settings));
        client.quit();
    }
};