const mongoose = require("mongoose");

const ChannelSchema = new mongoose.Schema({
  public: {
    type: Boolean,
    default: false,
  },
  messages: {
    type: [mongoose.Schema.ObjectId],
    ref: "Message",
  },
  users: {
    type: [mongoose.Schema.ObjectId],
    ref: "Users",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Channel", ChannelSchema);
