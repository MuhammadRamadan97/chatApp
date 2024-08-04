require('dotenv').config();

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const SocketIO = require('socket.io');
const mongoose = require('mongoose'); // Ensure mongoose is included for MongoDB
const Message = require('./models/Message');
const User = require('./models/User');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
let onlineUsersList = [];
const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
    }
};

connectToDatabase();
app.prepare().then(() => {
    const server = createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    });

    const io = SocketIO(server);

    io.on('connection', (socket) => {
        console.log('a user connected', socket.id);

        // Emit users list when a new user connects
        User.find({})
            .then(users => {

                io.emit('users list', users); // Emit updated users list
            })
            .catch(err => console.log(err));

        socket.on('disconnect', () => {
            console.log('user disconnected', socket.id);
            onlineUsersList = onlineUsersList.filter(user => user.id !== socket.id);
            io.emit('online users list', onlineUsersList); // Emit updated online users list
        });

        socket.on('chat message', (msg) => {
            console.log('Message received: ', msg);
            const { text, sender, receiver, time } = msg;
            const newMessage = new Message({ text, sender, receiver, time });
            newMessage.save()
                .then(savedMessage => {
                    console.log('Message saved to database');
                    io.emit('chat message', savedMessage); // Emit new message to all clients
                })
                .catch(err => console.log(err));
        });

        socket.on('user info', (user) => {
            const newUser = { username: user.username, id: socket.id };
            const existingUser = onlineUsersList.find(u => u.id === newUser.id);

            if (!existingUser) {
                onlineUsersList.push(newUser);
            }

            io.emit('online users list', onlineUsersList); // Emit updated online users list
        });
    });



    const PORT = process.env.PORT || 3000;
    server.listen(PORT, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${PORT}`);
    });
});
