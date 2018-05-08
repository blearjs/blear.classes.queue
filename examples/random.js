/**
 * 文件描述
 * @author ydr.me
 * @create 2018-05-08 18:05
 * @update 2018-05-08 18:05
 */


'use strict';

module.exports = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};


