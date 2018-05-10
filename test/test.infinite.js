/**
 * mocha 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';

var expect = require('chai-jasmine').expect;
var Queue = require('../src/index.js');
var reasonable = require('./reasonable');

describe('无限功能', function () {

    it('无限单并发', function (done) {
        var q = new Queue({
            infinite: true
        });
        var list = [];
        var startTime = Date.now();

        q.push(function (done) {
            setTimeout(function () {
                list.push(1);
                done();
            }, 100);
        });

        q.start();

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

        q.unshift(function (done) {
            setTimeout(function () {
                list.push(4);
                done();
            }, 100);
        });

        var afterWorkTimes = 0;
        var list2 = [1, 4, 2, 3];
        q.on('afterWork', function (work) {
            expect(list[afterWorkTimes]).toBe(list2[afterWorkTimes]);
            afterWorkTimes++;

            if (afterWorkTimes === list2.length) {
                expect(reasonable(Date.now() - startTime, 400, 4)).toBeTruthy();
                done();
            }
        });
    });

    it('无限三并发', function (done) {
        var q = new Queue({
            concurrence: 3,
            infinite: true
        });
        var list = [];
        var startTime = Date.now();

        q.push(function (done) {
            setTimeout(function () {
                list.push(1);
                done();
            }, 100);
        });

        q.start();

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

        var afterWorkTimes = 0;
        q.on('afterWork', function () {
            afterWorkTimes++;
            expect(list.length).toBe(afterWorkTimes);

            if (afterWorkTimes === 3) {
                expect(reasonable(Date.now() - startTime, 100, 3)).toBeTruthy();
                done();
            }
        });
    });

    it('无限三并发 + stop', function (done) {
        var q = new Queue({
            concurrence: 3,
            infinite: true
        });
        var list = [];

        q.push(function (done) {
            setTimeout(function () {
                list.push(1);
                done();
            }, 100);
        });

        q.start();
        q.stop();

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

        q.push(function (done) {
            setTimeout(function () {
                list.push(4);
                done();
            }, 100);
        });

        var afterWorkTimes = 0;
        q.on('afterWork', function () {
            console.log('afterWork');
            afterWorkTimes++;
        });

        setTimeout(function () {
            expect(afterWorkTimes).toBe(1);
            done();
        }, 150);
    });

});

