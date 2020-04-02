'use strict';
const RES_BODY = {
    SUCCESS:{
        code: 200,
        msg: '处理成功'
    },
    INVALID_PARAM_ERR:{
        code: 400,
        msg: '参数错误'
    },
    SERVER_ERR:{
        code: 0,
        msg: '服务器报错'
    }
};
module.exports = {
    RES_BODY
};
