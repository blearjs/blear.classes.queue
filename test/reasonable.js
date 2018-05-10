/**
 * 文件描述
 * @author ydr.me
 * @create 2018-05-10 14:21
 * @update 2018-05-10 14:21
 */


'use strict';

/**
 * 判断两个时间是否在合理范围之内
 * 单次延迟上限为 10 ms
 * @param t1
 * @param t2
 * @param times
 * @returns {boolean}
 */
module.exports = function (t1, t2, times) {
    return Math.abs(t1 - t2) <= 10 * times;
};


