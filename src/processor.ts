import { spawn } from 'node:child_process';
import { ConsoleSender } from './app';

export class processor {
    software: any;
    currentContent: string[];
    constructor () {
        this.software;
        this.currentContent = [];
    }
    startServer = () => {
        console.log("Starting server...");
        this.software = spawn('java', ['-jar', '/var/minecraft/start.jar'], {cwd: "/var/minecraft"});
        this.software.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
            this.currentContent.push(`${data}`);
            ConsoleSender(this.currentContent);
        });
    }
}