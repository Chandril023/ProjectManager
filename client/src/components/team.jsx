import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './teams.css'; // Import CSS file for styling

const Team = () => {
  const [teams, setTeams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamMembers, setTeamMembers] = useState([{ email: '' },{ email: '' }]); // Initialize with one empty member
  const [errorMessage, setErrorMessage] = useState(false);
  useEffect(() => {
    // Fetch teams from the backend when the component mounts
    const fetchTeams = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/teams');
        setTeams(response.data);
        console.log(response.data); // Log fetched data
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };
  
    fetchTeams();
  }, []);
  const closeModal = () => {
    setShowModal(false);
    // Reset teamMembers to contain only one empty member when the modal is closed
    setTeamMembers([{ email: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send POST request to backend API to create a new team
      const response = await axios.post('http://localhost:4000/api/create-team', {
        teamName,
        teamMembers
      });
      console.log('New team created:', response.data);
      // Close the modal after team creation
      setShowModal(false);
      window.location.reload();

      // Optionally, you can redirect the user or display a success message here
    } catch (error) {
      console.error('Error creating team:', error);
      setErrorMessage('Error creating team');
      // Handle error
      setTimeout(() => {
        setErrorMessage(false);
      }, 2000);
  
    }
  };

  const handleAddMember = () => {
    // Add a new empty member to the teamMembers array
    setTeamMembers([...teamMembers, { email: '' }]);
  };

  const handleMemberChange = (index, value) => {
    // Update the email of the member at the given index
    const updatedMembers = [...teamMembers];
    updatedMembers[index].email = value;
    setTeamMembers(updatedMembers);
  };

  return (
    <div className='teams-container'>
       

  <div className='container-heading'>
    <div className='container-name'>TEAMS</div>
    <button onClick={() => setShowModal(true)}>Create Team</button>
  </div>
  <div className="team-cards-container-horizontal-scroll">
    {teams.map((team, index) => (
      <div className="team-card" key={index}>
        <div className="front">
          <h3>{team.teamName}</h3>
          <ul>
            {team.teamMembers.map((member, memberIndex) => (
              <li key={memberIndex}>{member.email}</li>
            ))}
          </ul>
        </div>
      </div>
    ))}
  </div>   
        <div className="team-select-container">
          {showModal && (
            <div className='overlay'>
            <div className="modal">
              <div className="modal-content">
                <span className="close" onClick={closeModal}>&times;</span>
                <h2>Create a New Team</h2>
                <form onSubmit={handleSubmit}>
                  <label>
                    Team Name:
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      required
                    />
                  </label>
                  <h3>Team Members:</h3>
                  {teamMembers.map((member, index) => (
                    <div key={index}>
                      <input
                        type="email"
                        placeholder="Email"
                        value={member.email}
                        onChange={(e) => handleMemberChange(index, e.target.value)}
                        required
                      />
                    </div>
                  ))}
                  <div className='team-buttons'>
    
                  <button className="add-member-button" type="button" onClick={handleAddMember}>Add Member</button>
                 
                  <button className="create-team-button" type="submit">Create Team</button>
                  <div className='error-message'>
                  {errorMessage !== '' && <p>{errorMessage}</p>}
                  {/* Your other UI elements */}
                   </div>
                  
                  </div>
                </form>
              </div>
            </div>
            </div>
          )}
        </div>
      </div>

  );
};

export default Team;
