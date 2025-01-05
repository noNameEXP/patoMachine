"use strict";

const QOI = {};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    QOI.decode = require('./decode');
    QOI.encode = require('./encode');
    module.exports = QOI;
} else {
    // Ensure these functions are defined globally for browser usage
    QOI.decode = window.decode;
    QOI.encode = window.encode;
    window.QOI = QOI;
}
