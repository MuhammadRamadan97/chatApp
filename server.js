require('dotenv').config();

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const SocketIO = require('socket.io');
const Message = require('./models/Message');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
let onlineUsersList = []; // Use let to allow reassignment

app.prepare().then(() => {
    const server = createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    });

    const io = SocketIO(server);

    io.on('connection', (socket) => {
        console.log('a user connected', socket.id);

        socket.on('disconnect', () => {
            console.log('user disconnected', socket.id);
            // Remove user from onlineUsersList when disconnected
            onlineUsersList = onlineUsersList.filter(user => user.id !== socket.id);
            io.emit('online users list', onlineUsersList);
        });

        socket.on('chat message', (msg) => {
            console.log('Message received: ', msg);
            const { text, sender, receiver, time } = msg;
            const newMessage = new Message({ text, sender, receiver, time });
            newMessage.save()
                .then(savedMessage => {
                    console.log('Message saved to database');
                    io.emit('chat message', savedMessage);
                })
                .catch(err => console.log(err));
        });

        socket.on('user info', (user) => {
            const newUser = { username: user.username, id: socket.id };
            const existingUser = onlineUsersList.find(u => u.id === newUser.id);

            if (!existingUser) {
                onlineUsersList.push(newUser);
            }

            io.emit('online users list', onlineUsersList);
        });
    });

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${PORT}`);
    });
});
