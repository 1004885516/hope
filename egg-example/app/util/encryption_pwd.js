'use strict'


const SHA256 = require('crypto-js/sha256')
const SHA3 = require('crypto-js/sha3')

// 密码加密

function encryptPassword (login, password){

    if(!login || !password){
        return null
    }

    const salt = SHA256(login).toString();
    const encryptPwd = SHA3(password + salt).toString();

    return encryptPwd

}

// 验证密码有效性

function validatePassword (login, pwd, userpwd){

    if(userpwd === this.encryptPassword(login, pwd)){
        
        return true;

    }else{

        return false;

    }

}
module.exports = {
    encryptPassword,
    validatePassword
}