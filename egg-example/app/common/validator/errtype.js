'use strict';


const SystemError = require('../error');

exports.isSystemError = function (err) {
    return (err instanceof SystemError)
};