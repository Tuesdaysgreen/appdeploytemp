/// <reference path="../typings/main.d.ts" />
import {File} from '../common/fileSystem/file';
import {IFSService} from '../common/services/iFSService';
import {FSService} from '../common/services/FSService';
import {MockFSService} from './MockFSService';
import sinon = require('sinon');
import Q = require('q');
import assert = require('assert');


// describe('Array', function() {
//     describe('#indexOf()', function() {
//         it('should return -1 when the value is not present', function() {
//             assert.equal(-1, [1, 2, 3].indexOf(5));
//             assert.equal(-1, [1, 2, 3].indexOf(0));
//         });
//     });
// });

describe('File operations', function(){
    var fs = new MockFSService();

    describe('File Save', function(){
        it('Should write and update timestamp of file', function() {
            var modified = new Date(2016, 1, 15);
            var content = "hello world";
            var file = new File(fs, "/dest/", "foo.txt");
            file.content = content;
            file.size = file.content.length;
            file.modified = modified;

            return file.save().then(() =>{
                var savedFile = fs.getMockFile(file.fullPath);
                assert(!!savedFile, "File not saved");
                assert.equal(savedFile.content, content, "Content not equal");
                assert.equal(savedFile.size, content.length, "Size not equal");
                assert.equal(savedFile.modified, modified, "Modified time not equal");
            },(error) =>{
                console.log(`Failed: ${error}`);
            });
        });
    });

    // var sandbox = sinon.sandbox.create({ useFakeTimers: false });
    // var fs = new FSService();
    // var existsStub : Sinon.SinonStub;
    // var unlinkStub: Sinon.SinonStub;
    // var writeStub: Sinon.SinonStub;
    // var utimesStub: Sinon.SinonStub;

    // before(function() {
    //     existsStub = sandbox.stub(fs, 'exists', () => {
    //         return Q(true);
    //     });

    //     unlinkStub = sandbox.stub(fs, 'unlink', () =>{
    //         return Q(null);
    //     });

    //     writeStub = sandbox.stub(fs, 'writeFile', () =>{
    //         return Q(null);
    //     });

    //     utimesStub = sandbox.stub(
    //         fs,
    //         'utimes',
    //         (fullPath : string, atime : Date, mtime : Date) => {

    //         return Q(null);
    //     });
    // })

    // afterEach(function() {
    //     sandbox.restore();
    // });

    // describe('File Save', function(){
    //     it('Should delete file if it exists, then write, then update timestamp', function(){
    //         var file = new File(fs, "/dest/", "foo.txt");

    //         return file.save().then(() =>{
    //             assert.equal(true, unlinkStub.calledOnce);
    //         },(error) =>{
    //             console.log("failed");
    //         });
    //     })
    // });
});