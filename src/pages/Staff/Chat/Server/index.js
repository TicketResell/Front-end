const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Store messages in-memory (for simplicity, use a database for production)
const messages = [];

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Send existing chat history when a new client connects
    socket.emit('chatHistory', messages);

    // Listen for new messages from clients
    socket.on('sendMessage', (msg) => {
        const message = { id: socket.id, ...msg };
        messages.push(message);
        
        // Broadcast the message to all connected clients
        io.emit('receiveMessage', message);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
