import express from 'express';
import path from 'path';
declare var require: any;
import { processor as nodeprocess } from './processor';
var processor = new nodeprocess();
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

http.listen(3000, () => {
    console.log(`listening on *:${3000}`);
});

io.on("connection", (socket:any) => {
    console.log('a user connected');
    let out_to_client = processor.currentContent;
    io.emit('consoleContent', out_to_client.slice(-50));
    // Receiving messages from clients via socket:
    socket.on('sendConsoleCommand', (args) => {
        processor.sendCommand(args); // Here we pass through the message to the processor
    });

    socket.on('startServer', () => {
        // We pass the request to processor
        processor.startServer().then(() => {
            // Processor resolved the request, so it has been started as requested
            socket.emit("state", "started");
        }).catch(() => {
            // Processor rejected the request, this means the service already running
            socket.emit("state", "already");
        });
    });

    socket.on('killServer', () => {
        // We pass the request to processor
        processor.killServer().then(() => {
            // Processor resolved the request, so it has been killed as requested
            socket.emit("state", "killed");
        }).catch(() => {
            // Processor rejected the request, this means the service already killed
            socket.emit("state", "not-running");
        });
    });

    // Event from client via socket
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

app.get('/', (req:any, res:any) => {
    res.sendFile(path.resolve('public/console.html'));
});

// This exported function stands for transporting the required message (which is an array of strings) to the frontend via socket message.
export const ConsoleSender = (message:string[]) => {
    // We send the information on the frontend socket listener.
    io.emit('consoleContent', message.slice(-50));
};

// A simple feedback for the service issuer to know everything started successfully.
console.log("Microservice is running");