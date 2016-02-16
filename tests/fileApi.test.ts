/// <reference path="../typings/main.d.ts" />
import {File} from '../common/fileSystem/file';
import {IFile} from '../common/models/iFile';
import {FSService} from '../common/services/FSService';
import {MockSocketService} from './MockSocketService';
import {MockFSService} from './MockFSService';
import {FileApi} from '../server/fileApi';
import {FileApis} from '../common/constants';
import sinon = require('sinon');
import Q = require('q');
import assert = require('assert');

describe('File API tests', function(){
    var fs = new MockFSService();
    var socket = new MockSocketService();

    describe('Send File', function(){
        it('Should save file and deserialize time', function(){
            var content = 'some content';
            var modified = new Date();

            var file = <IFile>{
                name : 'foo.txt',
                path : '/dest/foo.txt',
                basePath: '/root/',
                fullPath: '/root/dest/foo.txt',
                size: content.length,
                content: content,
                modified: <any>modified.toString(),
                isDirectory: false
            };

            var api = new FileApi(socket, fs);
            api.init();
            socket.callMockEvent(FileApis.sendFile, file);

            var savedFile = fs.getMockFile(file.fullPath);
            assert(!!savedFile, "File not saved");
            assert.equal(savedFile.name, file.name);
            assert.equal(savedFile.path, file.path);
            assert.equal(savedFile.basePath, file.basePath);
            assert.equal(savedFile.fullPath, file.fullPath);
            assert.equal(savedFile.size, file.size);
            assert.equal(savedFile.content, file.content);
            assert.equal(savedFile.isDirectory, file.isDirectory);
        });
    });
});