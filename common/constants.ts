export = Main;
module Main{
    'use strict';
    export class Paths{
        public static sBasePath = '/scratch/source';
        public static dBasePath = '/scratch/dest';
        // public static dBasePath = 'd:/home/site/wwwroot/dest';
    }

    export class Connection{
        public static port = 3000;
        public static url = "http://localhost:" + Connection.port;
        // public static url = 'http://ehdeploy.azurewebsites.net';
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

    export class ChangeApis{
        public static respondDirChange = "respondDirChange";
        public static respondFileChange = "respondFileChange";
    }
}