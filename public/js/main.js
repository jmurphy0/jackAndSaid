const socket = io();

const messages = document.getElementById('messages');
const form = document.getElementById('form');
const input = document.getElementById('input');
const waitingMessage = document.getElementById('waitingMessage');
const newFriend = document.getElementById('addFriend');



//Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})


console.log(username, room)

// function joinedRoom(){
//     socket.emit('joined room', { username, room });
//     console.log('yey it worked')
// }
if (typeof(room) !== 'undefined') {
    socket.emit('joined room', { username, room });
}
socket.on('rooms details',allRoomsArray=>{
    console.log(allRoomsArray)
})
// let roomsArray = []
// Get room users
socket.on('room users',({room,users}) =>{
    // outputRoomName(room);
    // outputUsers(users);
    // console.log(users)
    //Get How person in each room as an object in array to send to server

    // roomsArray.push({room , users : users.length})
    // console.log(`in room: ${room} there is ${users.length} users`)
    // console.log(roomsArray)

    socket.emit('rooms details', room )

    // console.log(users.length)
    if(users.length>1){
        waitingMessage.classList.add('hideMessage');
        //Make Add Friend Button Work
        newFriend.addEventListener('click',()=>{
            // console.log('add new friend')
            socket.emit('add friend',);
        })
    }
})

socket.on('added',user=>{
    var item = document.createElement('li');
    const div = document.createElement('div');
    div.classList.add('message')
    div.innerHTML = `<p class ="meta"> ${user.username} ${user.text} </p>`;
    item.appendChild(div)
    messages.appendChild(item);
})
socket.on('add sent',user=>{
    var item = document.createElement('li');
    const div = document.createElement('div');
    div.classList.add('message')
    div.innerHTML = `<p class ="meta"> ${user.text}</p>`;
    item.appendChild(div)
    messages.appendChild(item);
})
socket.on('add friend',user =>{
    console.log(user);
    var item = document.createElement('li');
    const div = document.createElement('div');
    div.classList.add('message')
    div.innerHTML = `<p id="toBeHidden" class ="meta"> ${user.username} ${user.text}
    <button  onclick="animate(event)" class='btn1 btn btn-dark btn-sm'> Add Friend
    <span class='color color--blue' data-value='1'></span>
    <span class='color color--orange' data-value='1'></span>
    <span class='color color--green' data-value='1'></span>
    <span class='color color--white' data-value='1'></span>
</button> Or <button id="toBeDisconnected" class="btn btn-sm btn-secondary decline">Decline</button> </p> `;
    item.appendChild(div)
    messages.appendChild(item);
    var script = document.createElement('script');
    var t = document.createTextNode(`
    const acceptButton = document.querySelector('.btn1');
    acceptButton.addEventListener('click',(e)=>{
      e.preventDefault();
      console.log("It's A Match")
      socket.emit('added');
      acceptButton.classList.add('btn1--clicked');
      document.querySelectorAll('span').forEach((element)=>{element.classList.add('expanded')})
       setTimeout(()=>{acceptButton.classList.remove("btn1--clicked")},3500);
       setTimeout(()=>{document.querySelectorAll('span').forEach((element)=>{element.classList.remove('expanded')})},1700)
       setTimeout(()=>{document.getElementById('toBeHidden').innerText  = "${user.username} has been added to your friends list!"}, 3000);
       });
    const declineButton = document.querySelector('.decline');
    declineButton.addEventListener('click',(e)=>{
        e.preventDefault();
        setTimeout(()=>{document.getElementById('toBeHidden').innerText  = "Declined ${user.username}'s request!"}, 100);
        setTimeout(()=>{socket.disconnect()}, 1000)
    });
    `
    )
    script.appendChild(t);
    document.body.appendChild(script);
    // alert(`${user.username} has Sent You a Friend Request`);
})

form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
        input.focus();
    }
});

socket.on('message', message => {
    console.log(message);
    var item = document.createElement('li');
    const div = document.createElement('div');
    div.classList.add('message')
    div.innerHTML = `<p class ="meta"> ${message.username} - <span> ${message.time}</span></p>
    <p class="text">${message.text} </p>`;
    // item.textContent =
    item.appendChild(div)
    messages.appendChild(item);
})

socket.on('chat message', function (msg) {
    console.log(msg.username)
    console.log(username)
    let name =''
    if (username === msg.username ) {
        name ='me'
    }else {
        name = msg.username
    }
    var item = document.createElement('li');
    const div = document.createElement('div');
    div.classList.add('message')
    div.innerHTML = `<p class ="meta"> ${name} - <span> ${msg.time}</span></p>
    <p class="text">${msg.text} </p>`;
    // item.textContent =
    item.appendChild(div)
    messages.appendChild(item);
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


// LOG IN PAGE BUTTON JS
const container = document.querySelector('.fancybtn');
container.addEventListener('animationend', () => {
    container.classList.remove('active');
});
