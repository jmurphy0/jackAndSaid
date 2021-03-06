# PantherChatroom

**------------------------------------------------------------PROJECT 2----------------------------------------------------------------**
                                                             ===========

                           front-end    +    RESTful API calls    +    backend     +     database
                              | |                   | |                  | |                | |
                           Bootstrap 5       GET\POST\DELETE\PUT     Use Node+Express     MySQL (ORM)
                                          ___________
                        \\\\\\\\\\\\\    |           |    ( https://socket.io/docs/v3/index.html ) ::::::::\
                         |NEW LIBRARY :: | Socket.IO | :: ( https://socket.io/docs/v3/client-api ) :::::::::}~~>
                        /////////////    |___________|    ( https://socket.io/docs/v3/server-api ) ::::::::/

                                 
**-------------------------------------------Some Ideas To Improve The Application-----------------------------------------------------**
                                                        1-Show who’s online.
                                                      2-Add private messaging.
                                                    3-Add support for nicknames.
                                               4-Add “{user} is typing” functionality.
                                       5-Don’t send the same message to the user that sent it.
                             6-Broadcast a message to connected users when someone connects or disconnects.
**-------------------------------------------------------------------------------------------------------------------------------------**
**---------------------------------------------LogIn/SignUp      -     Chatting Room---------------------------------------------------**
                                                   | |                      | |
                                            __MYSQL(Heroku)__           __SOCKET.IO__
                             _______________________|________________________|___________________________
    ________________________/_____________________       _____________|__     ____________\ _____________
   |______________________USERS____________________|    |_____chats______|    |__________Matches__________|
   |--|----|---|-----|-------|-------|---|---------|    |--|-----|-------|    |-------|-------------|-----|
   |ID| FN | LN| Age | Gendre|Picture|BIO|LogIn_Id |____|ID|Name |Message|    |USER_ID|Shown_User_Id|Liked|
   |__|____|___|_____|_______|_______|___|_________|1  1|__|_____|_______|    |_______|_____________|_____|
    *|__________________________________________________________________________________________| *
  
  users update to :
    |ID| FN | LN| Age | Gendre |Picture|BIO|UserName| Password|Email|Question(forget password)|

chat rooms (IN the end)

**-------------------------------------------------------------------------------------------------------------------------------------**          
* LINT Tool* ==> automated checking of the source code for programmatic and stylistic errors.          
* NPM package dotenv* ==> Wont expose sensitive API key information on the server.
* Test with npm i -D jest (ex: https://socket.io/docs/v3/testing/#Example-with-jest).         


**-------------------------------------------------------------------------------------------------------------------------------------**
* Structured at least loosely MVC:
 /project2
  -/public (all the html, the ‘view’ component)
  -/public/assets (all the images, css, js)
  -/app (all the server-side logic)
  -/app/orm.js (the ‘model’ component)
  -/app/routes (for the routing logic, or ‘controller’ component)
  -server.js
**-------------------------------------------------------------------------------------------------------------------------------------**

picture uploading  :  https://github.com/c0dehot/node-picture-upload

               
**-------------------------------------------------------------LOGIN/SIGN UP-----------------------------------------------------------**

**-------------------------------------------------------------CHOICES-----------------------------------------------------------**
Start a new random chat
        If all is good : ADD as a friend
        else Start new chat
             Go to main room
             
    IF no other person is available ( waiting room )
        
select a friend to chat with
create a room for multiple friends 
update profile info 


