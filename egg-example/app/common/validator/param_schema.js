'use strict'
const Joi = require('@hapi/joi');
/**
 * 用户信息相关参数验证规则
 * 可扩展其他类型的验证规则，在下面定义模版即可
 */
const userBodySchema = Joi.object({
    action: Joi.string()
        .required(),
    login: Joi.string()
        .alphanum()  // 字母数字
        .min(6)
        .max(12)
        .required(),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    name: Joi.string()
})

module.exports = {
    userBodySchema
}