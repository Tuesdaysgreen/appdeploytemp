/// <reference path="../typings/main.d.ts" />

import fs = require('fs');
import {ISocketService} from '../common/services/iSocketService';
import sinon = require('sinon');
import Q = require('q');

export = Main;
module Main {

    export interface IEventObj{
        event: string;
        data: any;
    }

    export class MockSocketService implements ISocketService {
        public events : IEventObj[] = [];
        private _callBacks = {};

        public emit(event: string, data : any): ISocketService{
            this.events.push({ event: event, data: data });
            return this;
        }

        public on(event: string, fn: Function): ISocketService{
            this._callBacks[event] = fn;
            return this;
        }

        public callMockEvent(event : string, data : any){
            this._callBacks[event](data);
        }
    }
}