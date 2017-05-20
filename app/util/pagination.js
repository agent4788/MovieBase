/**
 * Created by oliver on 20.05.17.
 *
 * Hilfsklasse zum berechnen der Blätterfunktion
 */

'use strict';

module.exports = class Pagination {

    constructor(elementCount, elementsAtPage, start) {

        this._elementCount = elementCount;
        this._elementsAtPage = elementsAtPage;
        this._start = start;
    }

    get elementsAtPage() {
        return this._elementsAtPage;
    }

    get firstPage() {
        return 1;
    }

    get lastPage() {
        return Math.ceil(this._elementCount / this._elementsAtPage);;
    }

    get currentPage() {
        return Math.floor(this._start / this._elementsAtPage) + 1;
    }

    get nextPage() {
        return this.currentPage + 1;
    }

    get next2Page() {
        return this.currentPage + 2;
    }

    get previousPage() {
        return this.currentPage - 1;
    }

    get previous2Page() {
        return this.currentPage - 2;
    }

}
