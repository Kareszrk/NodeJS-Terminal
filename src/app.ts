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
    io.emit('consoleContent', out_to_client.slice(-80));
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

io.on('sendConsoleCommand', (args: string) => {
    processor.sendCommand(args);
});

app.get('/', (req:any, res:any) => {
    res.sendFile(path.resolve('public/console.html'));
});

export const ConsoleSender = (message:string[]) => {
    io.emit('consoleContent', message.slice(-80));
};

processor.startServer();

console.log("Works");