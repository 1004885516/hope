'use strict'


const Joi = require('@hapi/joi');
const { join } = require('lodash');

/**
 * book相关参数验证规则
 */

const bookSchema = Joi.object({
  action: Joi.string().required(),
  title: Joi.string().required(),
  author: Joi.string().required(),
  publisher: Joi.string().required(),
  language: Joi.string().required(),
  rootFile: Joi.string().required(),
  cover: Joi.string().required(),
  url: Joi.string().required(),
  originalName: Joi.string().required(),
  fileName: Joi.string().required(),
  coverPath: Joi.string().required(),
  filePath: Joi.string().required(),
  unzipPath: Joi.string().required(),
  path: Joi.string().required(),
  contents: Joi.array()
})


const getOneBookSchema = Joi.object({
  action: Joi.string().required(),
  fileName: Joi.string().required()
})

module.exports = {
  bookSchema,
  getOneBookSchema
}