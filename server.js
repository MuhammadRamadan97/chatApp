require('dotenv').config();
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const SocketIO = require('socket.io');
const Message = require('./models/Message');
const User = require('./models/User');
const mongoose = require('mongoose');

const connectWithRetry = () => {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            console.log('MongoDB is connected');
        })
        .catch(err => {
            console.error('MongoDB connection unsuccessful, retrying in 5 seconds.', err);
            setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
        });
};

connectWithRetry();

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
let onlineUsersList = [];

app.prepare().then(() => {
    const server = createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    });

    const io = SocketIO(server);

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('request messages', async ({ userId, selectedUserId }) => {
            try {
                await dbConnect(); // Ensure database connection

                // Fetch messages between the two users
                const messages = await Message.find({
                    $or: [
                        { sender: userId, receiver: selectedUserId },
                        { sender: selectedUserId, receiver: userId }
                    ]
                }).sort({ createdAt: 1 });

                socket.emit('response messages', JSON.stringify(messages));
            } catch (error) {
                console.error('Error fetching messages:', error);
                socket.emit('response messages', []);
            }
        });

        // Emit users list when a new user connects
        User.find({})
            .then(users => {
                io.emit('users list', users); // Emit updated users list
            })
            .catch(err => console.log(err));

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
            onlineUsersList = onlineUsersList.filter(user => user.id !== socket.id);
            io.emit('online users list', onlineUsersList); // Emit updated online users list
        });

        socket.on('chat message', (msg) => {
            console.log('Message received:', msg);
            const { text, sender, receiver, time } = msg;
            const newMessage = new Message({ text, sender, receiver, time });

            newMessage.save()
                .then(savedMessage => {
                    console.log('Message saved to database');
                    socket.broadcast.emit('chat message', savedMessage); // Emit only the new message
                })
                .catch(err => console.error('Error saving message:', err));
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
