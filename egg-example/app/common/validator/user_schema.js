'use strict'


const Joi = require('@hapi/joi');

/**
 * user相关参数验证规则,如下只是初步定义，后续可扩展
 */
const createUserSchema = Joi.object({
  username: Joi.string()
    .alphanum()  // 字母数字
    .min(6)
    .max(12)
    .required(),
  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  name: Joi.string(),
})

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
})

const userUpdateSchema = Joi.object({
  username: Joi.string()
    .required(),
  action: Joi.string(),
  name: Joi.string(),
})

const deleteUserSchema = Joi.object({
  _id: Joi.string()
    .required(),
  action: Joi.string(),
})

const getOneUserSchema = Joi.object({
  username: Joi.string(),
  action: Joi.string()
})

const getListUser = Joi.object({
  action: Joi.string(),
  select: Joi.object(),
  page: Joi.number(),
  limit: Joi.number(),
})

module.exports = {
  createUserSchema,
  loginSchema,
  userUpdateSchema,
  deleteUserSchema,
  getOneUserSchema,
  getListUser
}