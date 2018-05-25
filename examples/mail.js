/**
 * 文件描述
 * @author ydr.me
 * @create 2018-05-08 18:04
 * @update 2018-05-08 18:04
 */


'use strict';


var Queue = require('../src/index');
var random = require('./random');

var queue = new Queue({
    infinite: true
});

$('start').onclick = function () {
    queue.start();
    this.disabled = true;
    this.innerHTML = '已启动';
};

$('add').onclick = function () {
    var mail = buildMail();
    var el = log2(mail);

    queue.push(function (done) {
        el.classList.add('sending');
        send(mail, function () {
            el.classList.remove('sending');
            el.classList.add('sended');
            done();
        });
    });
};

// ============================================
function $(id) {
    return document.getElementById(id);
}

function randomName(maxLength) {
    return Math.random().toString(16).slice(2, maxLength + 2);
}

function buildMail() {
    return randomName(8) + '@' + randomName(4) + '.com';
}

function send(mail, callback) {
    log1('正在给 ' + mail + ' 发送邮件');
    var timeout = random(1000, 5000);
    setTimeout(function () {
        log1('完成给 ' + mail + ' 发送邮件，耗时 ' + timeout + 'ms');
        callback();
    }, timeout);
}

function log1(html) {
    $('log1').innerHTML += '<p>[' + new Date().toLocaleString() + '] ' + html + '</p>';
}

function log2(html) {
    var pEl = document.createElement('p');
    pEl.innerHTML = html;
    $('log2').appendChild(pEl);
    return pEl;
}
