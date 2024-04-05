const mongoose = require('mongoose');
const fs=require('fs')

const teamMemberSchema = new mongoose.Schema({
    name: String,
    email: String,
    domain: String,
    availability: { type: String, enum: ['available', 'unavailable'] }
});

const teamverseTeamSchema = new mongoose.Schema({
    teamId: Number,
    teamName: { type: String, unique: true },
    teamMembers: [teamMemberSchema]
});

const TeamverseTeam = mongoose.model('teamverseTeam', teamverseTeamSchema);

module.exports = TeamverseTeam;
