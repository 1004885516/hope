'use trict';


const Tracer = require('egg-tracer');

const counter  = 0;

/**
 * 生成traceId
 */

class myTracer extends Tracer {

    get ttracerId(){
        return `traceId:${counter++} - ${Date.now()} - ${process.pid}`
    }

};

module.exports = myTracer;
