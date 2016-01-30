export = Main;
module Main{
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
    }
}