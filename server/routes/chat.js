var jwt = require("jsonwebtoken");
const db = require("../db/db");
const checkJwt = require("./../middleware/checkAuth");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports = function (io) {
  var array_of_connection = [];
  let senderTokent;
  let sessionID = {};
  let id;

  io.use(function (socket, next) {
    if (socket.handshake.query && socket.handshake.query.token) {
      jwt.verify(socket.handshake.query.token, "lol", function (err, decoded) {
        if (err) return next(new Error("Authentication error"));
        socket.decoded = decoded;
        senderTokent = decoded;
        sessionID[id] = senderTokent.user._id;

        next();
      });
    } else {
      next(new Error("Authentication error"));
    }
  }).on("connection", function (socket) {
    array_of_connection.push(socket);

    socket._id = senderTokent.user._id;
    const sessionMap = {};

    socket.on("msg", function (message) {
      let id = message.id;
      sessionMap[message._id] = socket.id;

      //     db.userSchema.find({isAdmin: true}, function(err, admins) {
      //       const newMessage = new db.chatSchema();

      //       newMessage.from = message._id;

      //       for (let admin of admins) {
      //           newMessage.to.push(admin._id)
      //       }

      //       newMessage.content = message.message;

      //       newMessage.save();

      for (let i = 0; i < array_of_connection.length; i++) {
        if (array_of_connection[i]._id == id) {
          array_of_connection[i].emit("msg", message);
        }
      }
    });
    socket.on("new-post", (post) => {
      // let id = post.data._id
      //  sessionMap[post._id]  = socket.id
      //  socket.broadcast.emit('new-post', post.data)
      for (let i = 0; i < array_of_connection.length; i++) {
        //  if (array_of_connection[i]._id == id) {
        array_of_connection[i].emit("new-post", post);
        //  }
      }
    });

    socket.on('new-fr-req', (id) => {
      console.log('chat.js new-friend-request', id)
      for (let i = 0; i < array_of_connection.length; i++) {
        if (array_of_connection[i]._id == id) {


          db.userSchema.findOne({ _id: id })
            .exec((err, result) => {
              array_of_connection[i].emit("new-fr-req", result);
            })

        }
      }
    })

    socket.on('new-fr-req', (id) => {
      for (let i = 0; i < array_of_connection.length; i++) {
        if (array_of_connection[i]._id == id) {


          db.userSchema.findOne({ _id: id })
            .exec((err, result) => {
              array_of_connection[i].emit("new-fr-req", result);
              array_of_connection[i].emit('get-fr-req-data', '111111111')
            })

        }
      }
    })

    // socket.on('get-fr-req-data', (id) => {
    //   for (let i = 0; i < array_of_connection.length; i++) {
    //     if (array_of_connection[i]._id == id) {
    //       console.log('cha.js', id)

    //       db.userSchema.findOne({ _id: id })
    //         .exec((err, result) => {
    //           array_of_connection[i].emit('get-fr-req-data', '111111111')
    //         })

    //     }
    //   }
    // })
  });
};
