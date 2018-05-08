/**
 * blear.classes.queue
 * @author ydr.me
 * @create 2018年05月07日10:12:42
 */


'use strict';


var Events = require('blear.classes.events');
var object = require('blear.utils.object');

var STATE_WAITING = 0;
var STATE_RUNNING = 1;
var STATE_ENDDING = 2;
var state = 0;
var defaults = {
    /**
     * 并发数量
     * 大于1：则在并发内，并不会维持原始顺序
     * 等于1：维持原始顺序
     * @type number
     */
    concurrence: 1,

    /**
     * 是否无限
     * 是：可以随时添加任务进队列
     * 否：只能一开始添加
     * @type Boolean
     */
    infinite: false,

    /**
     * 超时
     * @type number
     */
    timeout: 0
};
var Queue = Events.extend({
    className: 'Queue',
    constructor: function (options) {
        var the = this;

        the.length = 0;
        the[_workingLength] = 0;
        the[_waitingList] = [];
        the[_running] = false;
        the[_state] = STATE_WAITING;
        Queue.parent(the);
        the[_options] = object.assign({}, defaults, options);
    },

    /**
     * 添加工作进队列尾部
     * @param work
     * @returns {Queue}
     */
    push: function (work) {
        return this[_wait]('push', work);
    },

    /**
     * 添加工作进队列首部
     * @param work
     * @returns {Queue}
     */
    unshift: function (work) {
        return this[_wait]('unshift', work);
    },

    /**
     * 开始工作
     * @returns {Queue}
     */
    start: function () {
        var the = this;

        if (the[_state] === STATE_WAITING) {
            the[_run]();
            return the;
        }

        return the;
    },

    /**
     * 暂停工作
     * @returns {Queue}
     */
    pause: function () {
        var the = this;

        if (the[_state] === STATE_RUNNING) {
            the[_state] = STATE_WAITING;
            return the;
        }

        return the;
    },

    /**
     * 恢复工作
     * @returns {Queue}
     */
    resume: function () {
        return this.start();
    },

    /**
     * 停止工作
     * @returns {Queue}
     */
    stop: function () {
        var the = this;

        the[_state] = STATE_ENDDING;
        the[_waitingList] = [];
        the.length = 0;

        return the;
    },

    /**
     * 销毁队列
     */
    destroy: function () {
        var the = this;

        Queue.invoke('destroy', the);
        the.stop();
    }
});
var sole = Queue.sole;
var proto = Queue.prototype;
var _options = sole();
var _workingLength = sole();
var _waitingList = sole();
var _wait = sole();
var _run = sole();
var _running = sole();
var _state = sole();

proto[_wait] = function (method, work) {
    var the = this;

    if (the[_state] === STATE_ENDDING) {
        throw new Error('队列已停止');
    }

    the[_waitingList][method]({
        work: work,
        id: workId()
    });
    the.length++;
    return the;
};

proto[_run] = function () {
    var the = this;
    var options = the[_options];

    // 1. 判断执行标记
    if (!the[_running]) {
        return;
    }

    // 2. 判断当前等待任务的数量
    if (!the[_waitingList].length) {
        // 非无限
        if (!options.infinite) {
            the[_state] = STATE_ENDDING;
            the.emit('end');
        }

        return;
    }

    // 3. 判断当前正在执行的工作是否超过并发上限
    if (the[_workingLength] >= options.concurrence) {
        return;
    }

    // 4. 获取一个可以执行的工作开始执行
    var waiter = the[_waitingList].shift();
    var work = waiter.work;
    var id = waiter.id;

    the.emit('beforeWork', work, id);
    the.length--;
    the[_workingLength]++;
    work(function () {
        the.emit('afterWork', work, id);
        the[_workingLength]--;
        the[_run]();
    });
};

Queue.defaults = defaults;
module.exports = Queue;


// ===================================================
var id = 1;

function workId() {
    return id++;
}
