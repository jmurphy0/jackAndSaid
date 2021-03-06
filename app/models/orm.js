/* eslint-disable curly */
/* eslint-disable no-redeclare */
/* eslint-disable eqeqeq */
/* eslint-disable camelcase */
/* ORM FOLDER ========================================
We abstract our database and information-modelling code
into this section
====================================================== */
require("dotenv").config();
const db = require("../config/connection.js")(
  process.env.NAME,
  process.env.DB_PASS
);
// an external npm package we are using
const moment = require("moment");
function isNotActive(username) {
  return db.query(
    `UPDATE users SET is_active="0" WHERE username ="${username}" `
  );
}

function isActive(username) {
  return db.query(
    `UPDATE users SET is_active="1" WHERE username ="${username}" `
  );
}

function getFriends(username) {
  return db.query(`SELECT friend FROM matches WHERE username = "${username}" `);
}

function addFriend(username, friend) {
  return db.query(
    `INSERT INTO matches SET username="${username}", friend="${friend}", friend_room="${username}-${friend}";`
  );
}

// returns all users
function getAllUsers() {
  return db.query("SELECT * FROM USERS");
}
// this info is what will be shown at the top of a chat
function getChatHeader(email) {
  return db.query(
    `SELECT first_name, img_path FROM USERS WHERE email ="${email}";`
  );
}

function updateUser(data) {
  return db.query(
    `UPDATE users SET first_name="${data.first_name}", last_name="${data.last_name}", bio="${data.bio}", email="${data.email}", age="${data.age}" WHERE username ="${data.username}" `
  );
}

function saveMsg(username, msg, time, mems) {
  return db.query(
    `INSERT INTO chats SET chat_name="${username}",messages="${msg}", time="${time}", chat_members="${mems}";`
  );
}

function getMemChat(user1, user2) {
  return db.query(
    `SELECT * FROM CHATS WHERE chat_members = "${user1}" || chat_members = "${user2}"  `
  );
}
// add new user to db
async function addUser(data) {
  console.log(data);
  inputData = {
    first_name: data.first_name,
    last_name: data.last_name,
    username: data.username,
    password: data.password,
    confirm_password: data.confirm_password,
    security_question: data.security_question,
    security_answer: data.security_answer,
  };
  // check unique username
  // var sql = 'SELECT * FROM users WHERE username =?';
  // db.query(sql, inputData.username, async function (err, data, fields) {
  //     if (err) {
  //         throw err
  //     }
  //     console.log(data)
  //     if (data.length > 1) {
  //         alert(inputData.username,' already exists!')
  //     } else if (inputData.confirm_password != inputData.password) {
  //         alert('Password & Confirm Password have to match')
  //     } else {
  // save users data into database
  var sql = "INSERT INTO users SET ?";
  return await db.query(sql, inputData);
}

// })
// }
function checkUser(username, password) {
  var sql = "SELECT * FROM users WHERE email_address =? AND password =?";
  db.query(sql, [username, password], function (err, data, fields) {
    if (err) throw err;
    if (data.length > 0) {
      req.session.loggedinUser = true;
      req.session.emailAddress = emailAddress;
      res.redirect("/dashboard");
    } else {
      res.render("login-form", {
        alertMsg: "Your Email Address or password is wrong",
      });
    }
  });
}
// returns fn, ln, username, email, bio and img path from users table
function getProfile(username) {
  return db.query(
    `SELECT first_name, last_name, age, email, bio, img_path FROM USERS WHERE username = "${username}";`
  );
}
function getFriendRoom(username) {
  return db.query(`SELECT chat_members FROM`);
}
function getRoomName(username, user2) {
  return db.query(
    `SELECT friend_room FROM matches WHERE username = "${username}" and friend = "${user2}" ||username = "${user2}" and friend = "${username}";`
  );
}

// delete a user from the users table
function deleteUser(id) {
  return db.query("DELETE FROM users WHERE id= ?", id);
}
//delete a chat from chats table
function deleteChat(id) {
  return db.query(("DELETE FROM chats WHERE id=?", id));
}

module.exports = {
  getAllUsers,
  getChatHeader,
  getProfile,
  deleteUser,
  deleteChat,
  addUser,
  saveMsg,
  getMemChat,
  updateUser,
  getFriends,
  addFriend,
  isActive,
  isNotActive,
  getRoomName,
};
