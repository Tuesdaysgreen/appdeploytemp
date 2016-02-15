/// <reference path="../../typings/main.d.ts" />

import fs = require('fs');
import {File} from './File';
import {IFile} from '../models/iFile';
import {IDirectory} from '../models/iDirectory';

export = Main;
module Main{
    'use strict';

    export class ChangeTracker{
        private _changes: { [dirPath: string]: number; } = {};

        public set(dirPath : string, changes : number) : void{
            if (changes > 0) {
                this._changes[dirPath] = changes;
            }
        }

        public dec(dirPath : string, numChanges : number) : void{

            if(numChanges === 0){
                // Can occur if a directory is empty
                return;
            }

            var dirChanges = this._changes[dirPath];
            if(dirChanges === null || dirChanges === undefined){
                throw Error("Directory '" + dirPath + "'' not being tracked or has already been removed");
            }

            var changesRemaining = dirChanges - numChanges;

            if(changesRemaining < 0){
                throw Error("Changes is less than 0");
            }

            if (changesRemaining === 0) {
                delete this._changes[dirPath];
            }
            else {
                this._changes[dirPath] = changesRemaining;
            }
        }

        public getTrackedDirCount() : number{
            return Object.keys(this._changes).length;
        }
    }
}