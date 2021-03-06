const socket = io();

const messages = document.getElementById('messages');
const form = document.getElementById('form');
const input = document.getElementById('input');
const waitingMessage = document.getElementById('waitingMessage');
const newFriend = document.getElementById('addFriend');

//Get username and room from URL
const { username } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

document.getElementById('createRoom').addEventListener('click', async () => {
    let user2 = document.querySelector('#secondUser').value;

    let room = await fetch(`/friendsRoom/${username}/${user2}`);
    console.log(username, room);
    socket.emit('joined friend room', { username, room });
    socket.on('rooms details', (allRoomsArray) => {
        console.log(allRoomsArray);
    });
});

// let roomsArray = []
// Get room users
socket.on('room users', ({ room, users }) => {
    socket.emit('rooms details', room);

    // console.log(users.length)
    if (users.length > 1) {
        waitingMessage.classList.add('hideMessage');
        //Make Add Friend Button Work
        newFriend.addEventListener('click', () => {
            // console.log('add new friend')
            socket.emit('add friend');
        });
    }
});

form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (input.value) {
        let user2 = document.getElementById('secondUser').value;
        console.log('friends.js', user2);
        socket.emit('chat message', input.value);
        let msg = input.value;
        let thisObj = { msg, user2 };
        socket.emit('friend message', thisObj);
        input.value = '';
        input.focus();
    }
});

// let requiredInput =

document.getElementById('createRoom').addEventListener('click', () => {
    if (document.getElementById('secondUser').value.length > 0) {
        let secondUserName = document.getElementById('secondUser').value;
        console.log(secondUserName);
        //Check in database if the user is available and then continue with this function
        //Save message with user name and second user name in database
        document.getElementById('messages').innerHTML = '';
        document.getElementById('input').disabled = false;
        socket.connect();
        console.log('username', username);
    // socket.emit('friend online',username)
    }
});

socket.on('message', (message) => {
    console.log(message);
    var item = document.createElement('li');
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class ="meta"> ${message.username} - <span> ${message.time}</span></p>
    <p class="text">${message.text} </p>`;
    // item.textContent =
    item.appendChild(div);
    messages.appendChild(item);
});

socket.on('chat message', function (msg) {
    console.log(msg.username);
    // console.log(username)
    let name = '';
    if (username === msg.username) {
        name = 'me';
    } else {
        name = msg.username;
    }
    var item = document.createElement('li');
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class ="meta"> ${name} - <span> ${msg.time}</span></p>
    <p class="text">${msg.text} </p>`;
    // item.textContent =
    item.appendChild(div);
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});
socket.on('pastMessages', (membersChat) => {
    console.log(membersChat);

    membersChat.forEach((msg) => {
        var item = document.createElement('li');
        const div = document.createElement('div');
        div.classList.add('message');
        div.innerHTML = `<p class ="meta"> ${msg.chat_name} - <span> ${msg.time}</span></p>
    <p class="text">${msg.text} </p>`;
        // item.textContent =
        item.appendChild(div);
        messages.appendChild(item);
    });

    window.scrollTo(0, document.body.scrollHeight);
});

////////Main Room going to random chat

// const roomName = document.getElementById('room-name');
// const userList = document.getElementById('users');

// //Add room name to Dom
// function outputRoomName(room){
//     roomName.innerText = room;
// }
// //Add users to Dom
// function outputUsers(users){
//     userList.innerHTML = `
//     ${users.map(user => `<li>${user.username}</li>`),join('')}
//     `;
// }
