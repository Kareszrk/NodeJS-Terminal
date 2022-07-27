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

io.on("connection", (socket) => {
    console.log('a user connected');
    io.emit('consoleContent', (processor.currentContent).slice(30));
    console.log(processor.currentContent);
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.resolve('public/console.html'));
});

export const ConsoleSender = (message) => io.emit('consoleContent', message);

processor.startServer();

console.log("Works");