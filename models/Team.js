const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  adminEmail: {
    type: String,
    required: true,
  },
  adminPassword: {
    type: String,
    required: true,
  },
  users: {
    type: [mongoose.Schema.ObjectId],
    ref: "User",
  },
});

module.exports = mongoose.model("Teams", TeamSchema);
