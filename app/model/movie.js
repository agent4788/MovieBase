/**
 * Created by oliver on 19.05.17.
 *
 * Film
 */

'use strict';

module.exports = class Movie {

    constructor() {

        this._id = '';
        this._title = '';
        this._subTitle = '';
        this._description = '';
        this._coverImg = '';
        this._year = 1900;
        this._disc = '';
        this._price = 0.0;
        this._duration = 0;
        this._fsk = 0;
        this._genre = '';
        this._rating = 0;
        this._registredDate = '1980-01-01';
        this._type = 1;
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

    get description() {
        return this._description;
    }

    set description(value) {
        this._description = value;
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

    get duration() {
        return this._duration;
    }

    set duration(value) {
        this._duration = value;
    }

    get fsk() {
        return this._fsk;
    }

    set fsk(value) {
        this._fsk = value;
    }

    get genre() {
        return this._genre;
    }

    set genre(value) {
        this._genre = value;
    }

    get rating() {
        return this._rating;
    }

    set rating(value) {
        this._rating = value;
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