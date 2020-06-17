'use strict';


const SystemError = require('../error');

exports.isSystemError = function (err) {
  return (err instanceof SystemError)
};

exports.isObject = function (obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
};

exports.isNumber = function (number) {
  return (typeof number === 'number');
};