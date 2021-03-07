const users = [];

//Join user to chat
function userJoin(id, username, room, isActive) {
    const user = { id, username, room, isActive };
    users.push(user);
    return user;
}

// Get current user

function getCurrentUser(id) {
    return users.find((user) => user.id === id);
}

// when user leaves chat
function userLeave(id) {
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

//Get room users
function getRoomUsers(room) {
    return users.filter((user) => user.room === room);
}

function getRoomReciever(room, sender) {
    console.log(`sender: ${sender} room: ${room}`);
    console.log(getRoomUsers(room));
    console.log(users);
    var otherperson = users.filter((user) => {
        user.room === room && user.username != sender;
    });
    return otherperson;
}

// function addFriend(){

// }

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
    getRoomReciever,
};
