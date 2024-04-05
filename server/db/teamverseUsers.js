const mongoose = require('mongoose');
const fs = require('fs');


const teamverseUserSchema = new mongoose.Schema({
  id: String,
  first_name: String,
  last_name: String,
  email: String,
  gender: String,
  avatar: String,
  domain: String,
  available: Boolean,
});

const TeamverseUser = mongoose.model('teamverseUsers', teamverseUserSchema);



module.exports = TeamverseUser;
