'use strict'
const jwt = require('jsonwebtoken');
function createTokenUser(user){
    return jwt.sign({
        id: user._id,
        name: user.name,
        login: user.login,
        password: user.password
    },
    'usersecret',
    {
        expiresIn: 60 * 60 *12
    })
}
module.exports = {
    createTokenUser
}