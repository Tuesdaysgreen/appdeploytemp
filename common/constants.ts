export = Main;
module Main{
    'use strict';
    export class Paths{
        public static sBasePath = '/scratch/source';
        public static dBasePath = '/scratch/dest';
        // public static dBasePath = '/home/site/wwwroot/dest';
    }

    export class Connection{
        public static port = 3000;
    }

    export class TraceApis{
        public static respondTraceInfo = "respondTraceInfo";
    }

    export class DirApis{
        public static sendDir = "sendDir";
        public static requestDir = "requestDir";
    }

    export class FileApis{
        public static requestFile = "requestFile";
        public static sendFile = "sendFile";
    }
}