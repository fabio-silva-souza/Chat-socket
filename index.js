const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const { Socket } = require('engine.io');
const formatMessage = require('./stuffJs/msg');
const {userJoin , getCurrentUser, userLeave, getRoomUsers} = require('./stuffJs/user');

const app = express();
const path = require('path');
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Bot Chat';

io.on('connection', (socket) => {
    socket.on('joinRoom', ({ username , room }) => {
    const user = userJoin( socket.id, username, room);

    socket.join(user.room);
    // welcome
    socket.emit('message', formatMessage(botName,'Welcome to Chat!'));

    //Broadcast 
    socket.broadcast
    .to(user.room)
    .emit('message', formatMessage(botName ,`${user.username} has joined the chat`));

    //Send users / room info
    io.to(user.room).emit('roomUsers', 
    {
        room: user.room,
        users: getRoomUsers(user.room)
    });
});
    
    //Listen 
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
    
        io.to(user.room).emit('message', formatMessage(user.username , msg));
    })

    // runs 
    socket.on('disconnet', () => {
        const user = userLeave(socket.id);

        if(user) {
            io.to(user.room).emit('message',
             formatMessage(botName,`${user.username} has left the chat`)
            );

            //Send 
            io.to(user.room).emit('roomUsers', {
               room: user.room,
               users: getRoomUsers(user.room)
    });
        }
        
    })
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
