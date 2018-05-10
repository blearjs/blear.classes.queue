/**
 * mocha 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';

var expect = require('chai-jasmine').expect;
var Queue = require('../src/index.js');
var reasonable = require('./reasonable');

describe('基本功能', function () {

    it('有限单并发', function (done) {
        var q = new Queue();
        var list = [];
        var startTime = Date.now();

        q.push(function (done) {
            setTimeout(function () {
                list.push(1);
                done();
            }, 100);
        });

        q.unshift(function (done) {
            setTimeout(function () {
                list.push(2);
                done();
            }, 100);
        });

        q.push(function (done) {
            setTimeout(function () {
                list.push(3);
                done();
            }, 100);
        });

        expect(q.length).toBe(3);
        q.start();
        q.start();

        q.on('end', function () {
            expect(list.length).toBe(3);
            expect(list[0]).toBe(2);
            expect(list[1]).toBe(1);
            expect(list[2]).toBe(3);
            expect(reasonable(Date.now() - startTime, 300, 3)).toBeTruthy();
            done();
        });
    });

    it('有限单并发 + pause', function (done) {
        var q = new Queue();
        var list = [];
        var startTime = Date.now();

        q.push(function (done) {
            setTimeout(function () {
                list.push(1);
                done();
            }, 100);
        });

        q.unshift(function (done) {
            setTimeout(function () {
                list.push(2);
                done();
            }, 100);
        });

        q.push(function (done) {
            setTimeout(function () {
                list.push(3);
                done();
            }, 100);
        });

        expect(q.length).toBe(3);
        q.start();
        q.start();

        // 这个时候应该1个执行完成了
        setTimeout(function () {
            expect(list.length).toBe(1);
            expect(list[0]).toBe(2);
            q.pause();
            q.pause();

            setTimeout(function () {
                q.resume();
            }, 100);
        }, 150);

        setTimeout(function () {
            expect(list.length).toBe(2);
            expect(list[0]).toBe(2);
            expect(list[1]).toBe(1);
        }, 250);

        q.on('end', function () {
            expect(list.length).toBe(3);
            expect(list[0]).toBe(2);
            expect(list[1]).toBe(1);
            expect(list[2]).toBe(3);
            expect(reasonable(Date.now() - startTime, 350, 3)).toBeTruthy();

            // 队列结束后启动无效
            q.start();

            // 队列全部完毕后不能再添加新工作
            q.push(function (done) {
                done();
            });
            expect(q.length).toBe(0);

            done();
        });
    });

    it('有限三并发', function (done) {
        var q = new Queue({
            concurrence: 3
        });
        var list = [];
        var startTime = Date.now();

        q.push(function (done) {
            setTimeout(function () {
                list.push(1);
                done();
            }, 100);
        });

        q.unshift(function (done) {
            setTimeout(function () {
                list.push(2);
                done();
            }, 100);
        });

        q.push(function (done) {
            setTimeout(function () {
                list.push(3);
                done();
            }, 100);
        });

        expect(q.length).toBe(3);
        q.start();
        q.on('end', function () {
            expect(list.length).toBe(3);
            expect(reasonable(Date.now() - startTime, 100, 1)).toBeTruthy();
            done();
        });
    });

});

