const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const ObjectId = require("mongoose").Types.ObjectId;
var multer = require("multer");
var fs = require("fs");
var path = require("path");

const checkJwt = require("./../middleware/checkAuth");
const db = require("../db/db");
const config = require("../config/config");

const DIR = "./posts";

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    cb(null, 1111 + ".PNG");
  },
});

let upload = multer({ storage: storage });

router.post("/new-post", checkJwt, upload.single("file"), (req, res, next) => {
  const text = req.body.data;

  var newPost = new db.postSchema();
  newPost.text = text;
  newPost.save((err, post) => {
    fs.rename("./posts/1111.PNG", `./posts/${post._id}.PNG`, (err) => {
      if (err) {
        es.json({
          success: false,
        });
      } else {
        res.json({
          success: true,
          post,
        });
      }
    });
  });
});

router.get("/get-posts", checkJwt, (req, res, next) => {
  let index = +req.headers["index"];
  db.postSchema.find({}, (err, doc) => {
    if (index > doc.length) {
      res.json({
        success: false,
      });
    } else {
      res.send(doc.slice(index, index + 3));
    }
  });
});
module.exports = router;
