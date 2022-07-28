import { spawn } from 'node:child_process';
import { ConsoleSender } from './app';
import path from 'path';

const __dirname = path.resolve(path.dirname(''));

export class processor {
    // Running child process in NodeJS source documentation: https://nodejs.org/api/child_process.html
    // We declare the types of varriables.
    software: any; // It literally can be anything it want.
    currentContent: string[]; // It's an array of strings
    constructor () {
        // We declare the publicly accessible varriables (avaliable for other files which calls this);
        this.software = false;
        this.currentContent = [];
    }
    // We make a function inside this class (publicly avaliable), when it gets called it starts the software in node's child process.
    startServer = () => {
        return new Promise<void>((resolve, reject) => {
            // We check whether or not the server is running already
            if(this.software) return reject(); // It does so we to avoid problems we reject the request. (And we return it to close the request)
            else {
                this.software = spawn('java', ['-jar', `${__dirname}/server/start.jar`], {cwd: `${__dirname}/server`});
                // We start a minecraft server by default within the /var/minecraft folder, defined in the options section in: "cwd"
                // As soon as we issued the command we listen for all the updates in the console
                resolve();
                // We can kill this process later with this PID: console.log(this.software.pid);
                this.software.stdout.on('data', (data) => {
                    // When we detect changes in the console we save it into a public varriable
                    this.currentContent.push(`${data}`);
                    // Then we pass it to the client via socket
                    ConsoleSender(this.currentContent);
                });
                // We put here a listener on software ends, when the programme finished we save it to this.software to ensure the server isn't running anymore.
                this.software.on('close', (code) => {
                    this.software = false; // We set this to false, so we can run the check at the beginning
                });
            }
        });
    }
    killServer = () => {
        return new Promise<void>((resolve, reject) => {
            // We check whether or not the server is running or killed already
            if(!this.software) return reject(); // This server is not running, so we reject the request.
            else {
                // We send a SIGNINT kill sign to the server.
                this.software.kill("SIGINT");
                this.software = false; // Here we set the software public varriable to false to run all the checks later correctly.
                return resolve(); // We killed the software so we resolved this case.
            }
        });
    }
    sendCommand = (command: string) => {
        // We recieved a command to send it to the child process, so we send it to
        if(this.software) this.software.stdin.write(`${command}\n`);
        // If the software isn't running we just ignore this request.
    }
}