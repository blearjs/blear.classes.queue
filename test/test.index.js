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

        q.push(function (done) {
            done();
        });

        expect(q.length).toBe(1);
        done();
    });

    it('#unshift', function (done) {
        var q = new Queue();

        q.unshift(function (done) {
            done();
        });

        expect(q.length).toBe(1);
        done();
    });

    it('order', function (done) {
        var q = new Queue();
        var list = [];

        q.push(function (done) {
            setTimeout(function () {
                list.push(1);
                done();
            });
        });

        q.unshift(function (done) {
            setTimeout(function () {
                list.push(2);
                done();
            });
        });

        q.push(function (done) {
            setTimeout(function () {
                list.push(3);
                done();
            });
        });

        expect(q.length).toBe(3);
        q.start();
        q.on('end', function () {
            expect(list.length).toBe(3);
            expect(list[0]).toBe(2);
            expect(list[1]).toBe(1);
            expect(list[2]).toBe(3);
            done();
        });
    });

});

