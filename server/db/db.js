const mongoose = require("mongoose");
var deepPopulate = require("mongoose-deep-populate")(mongoose);

const schema = mongoose.Schema;

const userSchema = new schema({
  name: String,
  email: String,
  password: String,
  isAdmin: { type: Boolean, default: false },
  image: { data: Buffer, contentType: String },
  gender: String,
  online: { type: Boolean, default: false },
  friends: [{ type: schema.Types.ObjectId, ref: "userSchema" }],
  friendRequest: [{ type: schema.Types.ObjectId, ref: "userSchema" }],
});
userSchema.plugin(deepPopulate);

const chatSchema = new schema({
  from: { type: schema.Types.ObjectId, ref: "userSchema" },
  to: [{ type: schema.Types.ObjectId, ref: "userSchema" }],
  content: String,
  date: { type: Date, default: Date.now },
});

const postSchema = new schema({
  owner: { type: schema.Types.ObjectId, ref: "userSchema" },
  text: String,
  // image: {data: Buffer, contentType: String}
  image: String,
});
module.exports.userSchema = mongoose.model("userSchema", userSchema);
module.exports.chatSchema = mongoose.model("chatSchema", chatSchema);
module.exports.postSchema = mongoose.model("postSchema", postSchema);
