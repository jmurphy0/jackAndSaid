/* eslint-disable eqeqeq */
/* eslint-disable no-redeclare */
/* eslint-disable curly */
/* eslint-disable camelcase */
/* eslint-disable no-trailing-spaces */
/* CONTROLLER FOLDER ========================================
The controller is the logical related to interaction and
'controlling' behaviour. In our serer-side code, the only
real controller elements are the 'router', so we create a
router folder
====================================================== */
require("dotenv").config();
const moment = require("moment");
const orm = require("../models/orm");
const db = require("../config/connection.js")(
  process.env.DB_HOST,
  process.env.DB_PASS
);
//Runs when client connects

function router(app) {
  app.get("./public/register.html", function (req, res, next) {
    res.render("registration-form");
  });
  // to store user input detail on post request
  app.post("./public/register.html", function (req, res, next) {
    inputData = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email_address: req.body.email_address,
      gender: req.body.gender,
      password: req.body.password,
      confirm_password: req.body.confirm_password,
    };
    // check unique email address
    var sql = "SELECT * FROM registration WHERE email_address =?";
    db.query(sql, [inputData.email_address], function (err, data, fields) {
      if (err) {
        throw err;
      }
      if (data.length > 1) {
        var msg = inputData.email_address + "was already exist";
      } else if (inputData.confirm_password != inputData.password) {
        var msg = "Password & Confirm Password is not Matched";
      } else {
        // save users data into database
        var sql = "INSERT INTO registration SET ?";
        db.query(sql, inputData, function (err, data) {
          if (err) throw err;
        });
        var msg = "Your are successfully registered";
      }
      res.render("registration-form", { alertMsg: msg });
    });
  });
  //Login
  app.get("/public/login", function (req, res, next) {
    res.render("login-form");
  });
  app.post("/public/login", function (req, res) {
    var emailAddress = req.body.email_address;
    var password = req.body.password;
    var sql = "SELECT * FROM users WHERE email_address =? AND password =?";
    db.query(sql, [emailAddress, password], function (err, data, fields) {
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
  });

  // to display registration form

  // app.get('/api/tasks/:due?', async function(req, res) {
  //     const due = req.params.due ? { due: req.params.due } : ''
  //     console.log( `[GET] getting list, due=${due}`)
  //     const list = await orm.getList( due )

  //     res.send( list )
  // })

  // app.post('/api/tasks', async function(req, res) {
  //     console.log( '[POST] we received this data:', req.body )
  //     const saveResult = await orm.insertTask( req.body.priority, req.body.info, req.body.due )
  //     console.log( `... insertId: ${saveResult.insertId} ` )

  //     res.send( { status: true, insertId: saveResult.insertId, message: 'Saved successfully' } )
  // });

  // app.put('/api/tasks', async function(req, res) {
  //     console.log( '[PUT] we received this data:', req.body )
  //     if( !req.body.id ) {
  //         res.status(404).send( { message: 'Invalid id' } )
  //     }

  //     const saveResult = await orm.updateTask( req.body.id, req.body.priority, req.body.info, req.body.due )
  //     console.log( '... ', saveResult )
  //     res.send( { status: true, message: 'Updated successfully' } )
  // });

  // app.delete('/api/tasks/:id', async function(req, res) {
  //     const taskId = req.params.id
  //     console.log( `[DELETE] id=${taskId}` )
  //     const deleteResult = await orm.deleteTask( taskId )
  //     console.log( '... ', deleteResult )

  //     res.send( { status: true, message: 'Deleted successfully' } )
  // });
}

module.exports = router;
