/**
 * 文件描述
 * @author ydr.me
 * @create 2018-05-08 18:04
 * @update 2018-05-08 18:04
 */


'use strict';

var Queue = require('../src/index');
var random = require('./random');

var q = new Queue({
    concurrence: 1,
    infinite: true
});

var time1 = 0;
var startTime = 0;
$('push').onclick = function () {
    var timeout = random(100, 1000);
    var work = function (callback) {
        setTimeout(function () {
            callback();
        }, timeout);
    };
    work.timeout = timeout;
    q.push(work);
    log1(work);
    time1 += timeout;
    $('time1').innerHTML = time1;
};

$('start').onclick = function () {
    q.start();
    startTime = Date.now();
};

q.on('afterWork', log2);
q.on('end', logEnd);

window.queue = q;

function $(id) {
    return document.getElementById(id);
}

function log1(work) {
    $('ret1').innerHTML += '<p>工作推入：' + work.timeout + 'ms</p>';
}


function log2(work) {
    $('ret2').innerHTML += '<p>工作完成：' + work.timeout + 'ms</p>';
    $('time2').innerHTML = Date.now() - startTime;
}

function logEnd() {
    $('ret2').innerHTML += '<p>全部工作完成</p>';
}
