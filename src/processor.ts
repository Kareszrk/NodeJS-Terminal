import { spawn } from 'node:child_process';
import { ConsoleSender } from './app';

export class processor {
    // Running child process in NodeJS source documentation: https://nodejs.org/api/child_process.html
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
            this.currentContent.push(`${data}`);
            ConsoleSender(this.currentContent);
        });
    }
    sendCommand = (command: string) => {
        console.log(command);
        this.software.stdin.write(`${command}\n`);
    }
}