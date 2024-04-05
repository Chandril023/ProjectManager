// server.js

const express = require('express');
const connectDB = require('./db/dbConnection');
const cors = require('cors');
const PORT = 4000;
const User = require('./db/teamverseUsers');
const Team = require('./db/teamverseTeams')
const app=express();
// Move the server startup logic inside connectDB callback
connectDB().then(() => {
  const app = express();
  app.use(cors());
  // Middleware to parse JSON bodies
  app.use(express.json());
  //get-users-api
  app.get('/api/users', async (req, res) => {
    try {
      // Fetch all users from the MongoDB collection
      const users = await User.find();
      // Respond with the array of user data
      res.json(users);
    } catch (error) {
      // Handle errors
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  // new-user-api
  app.post('/api/new-user', async (req, res) => {
    try {
        const { id,first_name, last_name, email, gender,avatar, domain, available } = req.body;
        if (!first_name || !last_name || !email || !gender ||!avatar || !domain || !available) {
          return res.status(400).json({ message: 'Missing required fields' });
      }
      const newUser = new User({
        id,
        first_name,
        last_name,
        email,
        gender,
        avatar,
        domain,
        available
    });
        await newUser.save();
        res.status(201).json({ success:true,message: 'New User Created successfully' });
     } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Error creating user' });
    }
});

// edit-user-api
app.put('/edit-user/:email', async (req, res) => {
  const userEmail = req.params.email;
  const userData = req.body;

  try {
    const { teamName } = req.body;

    // Query available users from different domains
    const teamMembers = await User.aggregate([
      { $match: { availability: true } },
      { $group: { _id: '$domain', users: { $push: '$$ROOT' } } },
      { $replaceRoot: { newRoot: { $arrayElemAt: ['$users', 0] } } },
    ]);

    // If not enough available users from different domains, return error
    if (teamMembers.length < 2) {
      return res.status(400).json({ error: 'Not enough available users from different domains' });
    }

    // Create a new team document
    const newTeam = new Team({
      teamName,
      teamMembers: teamMembers.map(member => member._id),
    });

    // Save the new team to the database
    await newTeam.save();

    res.status(201).json({ message: 'Team created successfully', team: newTeam });
  
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
app.delete('/delete-user/:email', async (req, res) => {
  const userEmail = req.params.email;

  try {
    // Find the user by email and delete it from the database
    const deletedUser = await User.findOneAndDelete({ email: userEmail });

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

//teams
app.post('/api/create-team', async (req, res) => {
  try {
    const { teamName, teamMembers } = req.body;

    // Create a new team document
    const newTeam = new Team({
      teamName,
      teamMembers,
    });

    // Save the new team to the database
    await newTeam.save();

    res.status(201).json({ message: 'Team created successfully', team: newTeam });
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/api/teams', async (req, res) => {
  try {
    // Fetch all teams from the database
    const teams = await Team.find();
    res.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
app.post('/api/team',async(req,res)=>{

})