/**
 * Created by oliver on 19.05.17.
 *
 * Film
 */

'use strict';

module.exports = class MovieBox {

    constructor() {

        this._id = '';
        this._title = '';
        this._subTitle = '';
        this._coverImg = '';
        this._year = 1900;
        this._disc = '';
        this._price = 0.0;
        this._movies = [];
        this._registredDate = '1980-01-01';
        this._type = 2;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get title() {
        return this._title;
    }

    set title(value) {
        this._title = value;
    }

    get subTitle() {
        return this._subTitle;
    }

    set subTitle(value) {
        this._subTitle = value;
    }

    get coverImg() {
        return this._coverImg;
    }

    set coverImg(value) {
        this._coverImg = value;
    }

    get year() {
        return this._year;
    }

    set year(value) {
        this._year = value;
    }

    get disc() {
        return this._disc;
    }

    set disc(value) {
        this._disc = value;
    }

    get price() {
        return this._price;
    }

    set price(value) {
        this._price = value;
    }

    get movies() {
        return this._movies;
    }

    set movies(value) {
        this._movies = value;
    }

    get registredDate() {
        return this._registredDate;
    }

    set registredDate(value) {
        this._registredDate = value;
    }

    get type() {
        return this._type;
    }
}