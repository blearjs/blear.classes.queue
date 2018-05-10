/**
 * mocha 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';

var expect = require('chai-jasmine').expect;
var Queue = require('../src/index.js');

describe('blear.classes.queue', function () {

    it('#push', function (done) {
        var q = new Queue();

        q.push(1);
        expect(q.length).toBe(1);
        q.stop();
        q.push(2);
        expect(q.length).toBe(0);
        done();
    });

    it('#unshift', function (done) {
        var q = new Queue();

        q.unshift(1);
        expect(q.length).toBe(1);
        q.destroy();
        q.unshift(2);
        expect(q.length).toBe(0);
        done();
    });

});

