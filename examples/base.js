/**
 * 文件描述
 * @author ydr.me
 * @create 2018-05-08 18:04
 * @update 2018-05-08 18:04
 */


'use strict';

var Queue = require('../src/index');
var random = require('./random');

var q = new Queue();

document.getElementById('push').onclick = function () {
    q.push(function (callback) {
        setTimeout(function () {
            callback();
        }, random(100, 1000));
    });
    console.log('当前队列长度', q.length);
};

document.getElementById('start').onclick = function () {
    q.start();
};

q.on('afterWork', function (work, id) {
    console.log('工作完成', id);
});

window.queue = q;

