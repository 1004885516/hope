'use strict'


module.exports = app => {
  require('./user')(app)
  require('./book')(app)
}