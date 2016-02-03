export = Main;
module Main{
    export interface IFile{
        name: string;
        path: string;      // Relative path
        basePath: string;  // Path from root of file system to beginning of relative path
        fullPath: string;
        size: number;
        modified: Date;
        isDirectory: boolean;
        content: any;
    }
}