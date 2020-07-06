const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3000;
const io = require('socket.io')(PORT);
const Filter = require('bad-words');
filter = new Filter();
const users = {};

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

io.on('connection', socket => {
    socket.on('new-user', user =>{
        if(user.name=="null")
        {
            user.name = "John-Doe";
        }
        user.name = filter.clean(user.name);
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
    socket.on('filterName', name=>{
        if(name=="null" || name.replace(/\s/g,'')=="")
        {
            name = "John-Doe";
        }
        socket.emit('filterName', filter.clean(name) );
    });
});