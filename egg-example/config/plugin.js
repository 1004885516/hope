'use strict';

/** @type Egg.EggPlugin */
// 这地方一个大坑，module.exports导致下面的配置不生效
// module.exports = {
//   // had enabled by egg
//   // static: {
//   //   enable: true,
//   // }
// };
exports.cors = {
    enable: true,
    package: 'egg-cors',
};

exports.mongoose = {
    enable: true,
    package: 'egg-mongoose',
};

exports.validate = {
    enable: true,
    package: 'egg-validate',
};
exports.tracer = {
    enable: true,
    package: 'egg-tracer'
};