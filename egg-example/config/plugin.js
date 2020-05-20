'use strict';


/** @type Egg.EggPlugin */

module.exports = {
    cors: {
        enable: true,
        package: 'egg-cors',
    },
    mongoose: {
        enable: true,
        package: 'egg-mongoose',
    },
    validate: {
        enable: true,
        package: 'egg-validate',
    },
    tracer: {
        enable: true,
        package: 'egg-tracer'
    }
};
