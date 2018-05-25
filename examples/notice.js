/**
 * 文件描述
 * @author ydr.me
 * @create 2018-05-08 18:04
 * @update 2018-05-08 18:04
 */


'use strict';

var Queue = require('../src/index');
var random = require('./random');

var times = 0;
var timeoutList = [
    // 0s
    0,
    // 5s
    2 * 1000,
    // 10s
    4 * 1000,
    // 20s
    8 * 1000,
    // 30s
    10 * 1000
];


$('start').onclick = function () {
    var el = this;
    el.disabled = true;
    $('log').innerHTML = '';
    var queue = new Queue();

    each(timeoutList, function (index, timeout) {
        queue.push(function (done) {
            log('第 ' + (index + 1) + ' 次通知发起……');
            notice(function (success) {
                if (success) {
                    log('第 ' + (index + 1) + ' 次通知到达成功，队列结束');
                    queue.stop();
                    el.disabled = false;
                    return;
                }

                // 等待下一次通知
                var nextTimeout = timeoutList[index + 1];

                if (nextTimeout === undefined) {
                    el.disabled = false;
                    log(timeoutList.length + ' 次通知到达失败，结束通知');
                    return;
                }

                log('第 ' + (index + 1) + ' 次通知到达失败，等待 ' + nextTimeout / 1000 + ' s后下一次通知');
                setTimeout(done, nextTimeout);
            });
        });
    });

    queue.start();
};


function notice(callback) {
    var timeout = random(1000, 5000);
    setTimeout(function () {
        callback(Math.random() > 0.6);
    }, timeout);
}

function $(id) {
    return document.getElementById(id);
}

function log(html) {
    $('log').innerHTML += '<p>[' + new Date().toLocaleString() + '] ' + html + '</p>';
}

function each(list, callback) {
    for (var i = 0, j = list.length; i < j; i++) {
        callback(i, list[i]);
    }
}



