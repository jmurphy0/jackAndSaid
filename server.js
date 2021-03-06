const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Qs = require('Qs');
const ormfnct = require('./app/models/orm');
const { userInfo } = require('os');
const PORT = process.env.PORT || 8080;
const formatMessage = require('./utils/messages');
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
    addFriend,
    getRoomReciever,
} = require('./utils/users');
const { getMemChat } = require('./app/models/orm');

const orm = require('./app/models/orm');
const dbConnect = require('./app/config/connection');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(__dirname + 'index.html');
});
app.get('/register', async function (req, res) {
    var users = await orm.getAllUsers();
    console.log('[Get] All users');
    res.send(users);
});
// to store user input detail on post request
app.post('/register', async function (req, res) {
    const userData = req.body;
    console.log(userData);
    const result = await orm.addUser(userData);
    console.log('[Post] ', userData, result);

    res.redirect('/mainroom.html');
});
//Login
app.get('/public/login', async function (req, res) {
    var users = await orm.getAllUsers();
    console.log('[Get] All users');
    res.send(users);
});
app.post('/public/login', async function (req, res) {
    var username = req.body.email_address;
    var password = req.body.password;
    var result = orm.checkUser(username, password);
    res.redirect('./public/mainroom.html');
});

//edit profile
app.get('/getProfile/:username', async function (req, res) {
    const username = req.params.username;
    //console.log('made it here', username)
    const userData = await ormfnct.getProfile(username);
    //console.log(userData)
    res.send(userData);
});

app.post('/editProfile/:username', async (req, res) => {
    const userdata = req.body;
    let inputData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        bio: req.body.bio,
        email: req.body.email,
        age: req.body.age,
        username: req.body.username,
    };
    await ormfnct.updateUser(inputData);
    console.log('User updated');
});

let friends = [];
// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(__dirname + 'index.html');
});

app.get('/friendsRoom/:username/:user2', async (req, res) => {
    let friendsRoom = {
        username: req.params.username,
        user2: req.params.user2,
    };
    console.log('HERE ', friendsRoom);
    let roomname = await ormfnct.getRoomName(
        friendsRoom.username,
        friendsRoom.user2
    );
    console.log(roomname);

    res.send(roomname);
});
// THERE IS 3 WAYS TO SEND MESSAGES:
// socket.emit()  ---> for the user
// socket.broadcast.emit() ---> for everyone except that user
// io.emit() ---> for everyone
let randomRoomsArray = [];

// app.get("/getChats/:username", (req, res) => {
//   console.log("madeithere");
//   membersChat = await getMemChat(`${users}`);
//     console.log(membersChat);
//   // console.log(req);
//   // console.log(res);
// });

io.on('connection', async (socket) => {
    // console.log('testing rooms',io.rooms)
    socket.emit('show friends', friends);
    socket.on('joined room', async ({ username, room }) => {
        let isActive = true;
        const user = userJoin(socket.id, username, room, isActive);
        console.log(user);
        await ormfnct.isActive(user.username);
        socket.join(user.room);
        socket.emit('new room', user.room);
        //to welcome user
        socket.emit(
            'message',
            formatMessage('PantherBot', 'Welcome to PantherChatroom!')
        );

        // Broadcast when a user connects
        socket.broadcast
            .to(user.room)
            .emit(
                'message',
                formatMessage('PantherBot', `${user.username} has joined the chat`)
            );

        //Send users and room info
        io.to(user.room).emit('room users', {
            room: user.room,
            users: getRoomUsers(user.room),
        });
    });
    //Made a different one for texting friends in different rooms than the random ones
    socket.on('joined friend room', ({ username, room }) => {
        let isActive = true;
        // room = 1
        console.log(room);
        const user = userJoin(socket.id, username, room, isActive);
        console.log(user);
        socket.join(user.room);
        console.log('trying to find out the user room', user.room);
        socket.emit('new room', user.room);
        //to welcome user
        socket.emit(
            'message',
            formatMessage('PantherBot', 'Welcome to PantherChatroom!')
        );

        // Broadcast when a user connects
        socket.broadcast
            .to(user.room)
            .emit(
                'message',
                formatMessage('PantherBot', `${user.username} has joined the chat`)
            );

        //Send users and room info
        io.to(user.room).emit('room users', {
            room: user.room,
            users: getRoomUsers(user.room),
        });
    });
    // console.log(`${socket.id} user connected`);
    // console.log(`user id: `,socket.id);

    //Get who is online
    // socket.emit('friend online', () => {
    //     console.log('this user is active now', username)
    //     let isActive = true
    //     const user = userJoin(socket.id, username, room, isActive)
    //     console.log(user)
    // })
    socket.on('sendUsername', async (username) => {
        let friends = await ormfnct.getFriends(username);

        socket.emit('showFriends', friends);
    });

    // When a chat is sent
    // socket.on("chat message", (msg) => {
    //   const user = getCurrentUser(socket.id);
    //   io.to(user.room).emit("chat message", formatMessage(user.username, msg));
    // });

    socket.on('add friend', () => {
        const user = getCurrentUser(socket.id);
        socket.broadcast
            .to(user.room)
            .emit(
                'add friend',
                formatMessage(`${user.username}`, 'wants to Add you as friend')
            );
        socket.emit(
            'add sent',
            formatMessage(`${user.username}`, 'You have sent a friend request')
        );
    });

    socket.on('added', () => {
        const user = getCurrentUser(socket.id);
        socket.broadcast
            .to(user.room)
            .emit(
                'added',
                formatMessage(`${user.username}`, ' has accepted your friend request!')
            );
        //console.log("added :", getRoomUsers(user.room));
        let user1 = getRoomUsers(user.room)[0].username;
        let user2 = getRoomUsers(user.room)[1].username;

        console.log(`${user1} and ${user2} are now friends`);
        ormfnct.addFriend(`${user1}`, `${user2}`);
        //ormfnct.addFriend(`${user2}`, `${user1}`);
        friends.push({ user1, user2 });
        console.log('friends list', friends);
    });
    socket.on('rooms details', (room) => {
        randomRoomsArray.push(room);
        // allRoomsArray.forEach(room=>{
        //     console.log(`eye${room.room}`)
        // })
        socket.emit('rooms details', randomRoomsArray);
    });

    //When User disconnects
    socket.on('disconnect', async () => {
    // console.log('user disconnected');
        const user = userLeave(socket.id);
        if (user) {
            io.to(user.room).emit(
                'message',
                formatMessage('PantherBot', `${user.username} has left the chat`)
            );
            io.to(user.room).emit('room users', {
                room: user.room,
                users: getRoomUsers(user.room),
            });
            console.log(`testing room number ${randomRoomsArray[0]}`);
            // we get the rooms from databse later on to see if they still have users aftersomeone leave
            console.log('array before[randomRoomsArray]', randomRoomsArray);
            let filteredRandomRoom = randomRoomsArray.filter(function (
                item,
                pos,
                self
            ) {
                return self.indexOf(item) === pos;
            });
            console.log('array after[filteredRandomRoom]', filteredRandomRoom);
            filteredRandomRoom.forEach((room) => {
                console.log('Room:', room);
                let x = getRoomUsers(room);
                console.log('The users in this room', x);
                if (x < 1) {
                    console.log(
                        `room ${room} is empty , need to be deleted from database`
                    );
                }
            });
            console.log(
                'The user that left and needs "isActive" to be changed to false in database is:',
                user
            );
            user.isActive = false;
            await ormfnct.isNotActive(user.username);
            console.log(user);

            // let x = getRoomUsers(filteredRandomRoom)
            // console.log(x)
            // x.forEach(user=>{
            //     console.log('users inside first room',user)
            // })
            // if (x === 1){
            //     console.log('There is one user in the room',filteredRandomRoom[0])
            // }
        }
    });

    // console.log(`${socket.id} user connected`);
    // console.log(`user id: `,socket.id);

    //When a chat is sent
    socket.on('chat message', async (msg) => {
        const user = getCurrentUser(socket.id);
        // --------- database work  and calls ------------------------
        let data = formatMessage(`${user.username}`, msg);

        //creating a unique field on both usernames to retrieve their chat from db
        let reciever = getRoomUsers(`${user.room}`);
        let users = [];
        reciever.forEach((person) => users.push(person.username));

        // saves messages between two users
        ormfnct.saveMsg(data.username, data.text, data.time, `${users}`);

        //gets all messages from a specific user
        //const allMessages = await ormfnct.allMesagesFromUser(user);

        // gets all messsages between two users

        //console.log(`room: );

        //-------------------------------------------------------

        io.to(user.room).emit('chat message', formatMessage(user.username, msg));
    });
    socket.on('friend message', async (friendsdata) => {
        console.log(friendsdata);
        const user = getCurrentUser(socket.id);
        // --------- database work  and calls ------------------------
        let data = formatMessage(`${user.username}`, friendsdata.msg);

        //creating a unique field on both usernames to retrieve their chat from db
        //let reciever = getRoomUsers(`${user.room}`);
        let users = [user.username, friendsdata.user2];
        let user1 = user.username + ',' + friendsdata.user2;
        let users2 = friendsdata.user2 + ',' + user.username;
        console.log(user1, users2);
        //reciever.forEach((person) => users.push(person.username));

        // saves messages between two users
        ormfnct.saveMsg(data.username, data.text, data.time, `${users}`);
    });
    //-------------------------------------------------------
    // socket.emit('friend message',()=>{
    //   const membersChat = await getMemChat(`${user1}`, `${users2}`);
    //   console.log(membersChat);
    // } )
    socket.on('add friend', () => {
        const user = getCurrentUser(socket.id);
        socket.broadcast
            .to(user.room)
            .emit(
                'add friend',
                formatMessage(`${user.username}`, 'wants to Add you as friend')
            );
        socket.emit(
            'add sent',
            formatMessage(`${user.username}`, 'You have sent a friend request')
        );
    });
    socket.on('getMessages', async (mems) => {
        const user1 = mems[0] + ',' + mems[1];
        const user2 = mems[1] + ',' + mems[0];
        const membersChat = await getMemChat(`${user1}`, `${user2}`);
        socket.emit('pastMessages', membersChat);
        console.log(membersChat);
    });

    socket.on('added', () => {
        const user = getCurrentUser(socket.id);
        console.log('added', user, getRoomUsers(user.room));
        socket.broadcast
            .to(user.room)
            .emit(
                'added',
                formatMessage(`${user.username}`, ' has accepted your friend request!')
            );
    });
    //When User disconnects
    socket.on('disconnect', () => {
    // console.log('user disconnected');
        const user = userLeave(socket.id);
        if (user) {
            io.to(user.room).emit(
                'message',
                formatMessage('PantherBot', `${user.username} has left the chat`)
            );
            io.to(user.room).emit('room users', {
                room: user.room,
                users: getRoomUsers(user.room),
            });
        }
    });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));