const io = require('socket.io')(3000);
const Filter = require('bad-words');
filter = new Filter();
const users = {};
io.on('connection', socket => {
    socket.on('new-user', user =>{
        if(user.name==null)
        {
            user.name = "John-Doe";
        }
        users[socket.id] = user;
        socket.broadcast.emit('user-connected',user);
    });
    socket.on('send-chat-message', message=>{
        socket.broadcast.emit('chat-message', { message: filter.clean(message), user: users[socket.id] } );
    });
    socket.on('disconnect-user', () =>{
        socket.broadcast.emit('user-disconnected',users[socket.id]);
        delete users[socket.id];
    });
    socket.on('filter', message=>{
        socket.emit('filter', filter.clean(message) );
    });
});