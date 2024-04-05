import React, { useState, useEffect } from 'react';
import './users.css'; // Import CSS file for styling
import userDataTxt from './information/jsonformatter.txt';
import axios from 'axios';

const Users = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Function to open the add modal
  const openAddModal = () => {
    setShowAddModal(true);
    setShowEditModal(false); // Ensure other modals are closed
    setShowDeleteModal(false);
  };
  
  // Function to open the edit modal
  const openEditModal = () => {
    setShowAddModal(false);
    setShowEditModal(true);
    setShowDeleteModal(false);
  };
  
  // Function to open the delete modal
  const openDeleteModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(true);
  };
  
  // Function to close all modals
  const closeModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
  };
  

  //add,edit,delete
  const [showEditUserForm, setShowEditUserForm] = useState(false);
  const [showDeleteUserForm, setShowDeleteUserForm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [editedUser, setEditedUser] = useState({
    id:'',
    first_name: '',
    last_name: '',
    email: '',
    avatar:'',
    gender: '',
    domain: '',
    available: ''
  });

  const [userData, setUserData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 20;
  const totalPages = Math.ceil(userData.length / usersPerPage);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(userDataTxt);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();
        setUserData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPaginationButtons = () => {
    const pageNumbers = [];
    let startPage, endPage;

    if (totalPages <= 5) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= 3) {
        startPage = 1;
        endPage = 5;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - 4;
        endPage = totalPages;
      } else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={currentPage === i ? 'active' : ''}
        >
          {i}
        </button>
      );
    }

    return pageNumbers;
  };

  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const displayedUsers = userData.slice(startIndex, endIndex);
  
 //adding new users
 const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newUser, setNewUser] = useState({
    id:'',
    first_name: '',
    last_name: '',
    email: '',
    avatar:'',
    gender:'',
    domain: '',
    available:''
  });

  const handleNewInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleNewSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:4000/api/new-user`, newUser);
      console.log('new-user-data:', response.data);
      // Reset the form
      setNewUser({
        id: '',
        first_name: '',
        last_name: '',
        email: '',
        avatar:  '',
        gender: '',
        domain: '',
        available: ''
      });
      // Close the form
      setShowEditUserForm(false);
    } catch (error) {
      console.error('Error adding new user:', error);
      // Handle error
    }
  };
  
  //fetching data
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []); 

  const handleSearchChange = (e) => {
    setSearchName(e.target.value);
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.first_name} ${user.last_name}`;
    return fullName.toLowerCase().includes(searchName.toLowerCase());
  });
  
  const handleSearchFilterClick = () => {
    setShowFilters(!showFilters); // Toggle the visibility of filter options
  };
  //edit
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:4000/edit-user/${editedUser.email}`, editedUser);
      console.log('User updated:', response.data);
      // Reset the form
      setEditedUser({
        id: response.data.id,
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        email: response.data.email,
        avatar:  response.data.avatar,
        gender: response.data.gender,
        domain: response.data.domain,
        available: response.data.available
      });
      // Close the form
      setShowEditUserForm(false);
      window.location.reload();
    } catch (error) {
      console.error('Error updating user:', error);
      // Handle error
    }
  };
  
  const [deleteEmail, setDeleteEmail] = useState('');

  const handleDeleteEmailChange = (event) => {
    setDeleteEmail(event.target.value);
  };

  const submitDeleteUser = async () => {
    try {
      // Ensure deleteEmail is set before attempting to delete
      if (!deleteEmail) {
        console.error('Delete email is not set.');
        return;
      }

      // Send DELETE request to delete user
      await axios.delete(`http://localhost:4000/delete-user/${deleteEmail}`);

      // Clear the deleteEmail state after successful deletion
      setDeleteEmail('');

      // Close the modal
      setShowDeleteUserForm(false);
      window.location.reload();
      // Optionally, update the user list after deletion
      // You can add a function here to fetch the updated user list or update the state
    } catch (error) {
      console.error('Error deleting user:', error);
      // Handle error
    }
   
  };

  return (
    <div>
      <div className='container-heading'>
        <div className='container-name'>USERS  
          <button className="add-user-button"  onClick={openAddModal}>
            Create
          </button>
          <button className='edit-user-button'  onClick={openEditModal}>
            Edit
          </button>
          <button className='delete-user-button'  onClick={openDeleteModal}>
            Delete
          </button>
        </div>
        <div className="search-filter-container">
          <input type="text" value={searchName} onChange={handleSearchChange} placeholder="Search by name" />
          <button className='search-filter-button' >FILTER</button>
        </div>
      </div>
      <div>
        <div>
          <div className="user-cards-container">
            {/* Display search results if searchName is not empty, otherwise display all users */}
            {searchName !== '' ? (
              
              filteredUsers.map((user, index) => (
                <div className="user-card" key={index}>
                  <img src={user.avatar} alt={`${user.first_name} ${user.last_name}`} />
                  <h3>{`${user.first_name} ${user.last_name}`}</h3>
                  <div className='user-card-attributes'>
                    <p>Email: {user.email}</p>
                    <p>Gender: {user.gender}</p>
                    <p>Domain: {user.domain}</p>
                    <p>Available: {user.available.toString()}</p>
                  </div>
                </div>
              ))
            ) : (
              users.slice(startIndex, endIndex).map((user, index) => (
                <div className="user-card" key={index}>
                  <img src={user.avatar} alt={`${user.first_name} ${user.last_name}`} />
                  <h3>{`${user.first_name} ${user.last_name}`}</h3>
                  <div className='user-card-attributes'>
                    <p>Email: {user.email}</p>
                    <p>Gender: {user.gender}</p>
                    <p>Domain: {user.domain}</p>
                    <p>Available: {user.available.toString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div>
          <div className="pagination">
            {currentPage !== 1 && (
              <button onClick={() => handlePageChange(currentPage - 1)}>&laquo;</button>
            )}
            {renderPaginationButtons()}
            {currentPage !== totalPages && (
              <button onClick={() => handlePageChange(currentPage + 1)}>&raquo;</button>
            )}
          </div>
        </div>

        {/* Add user form modal */}
        {showAddModal && (
          <div className="user-overlay">
          <div className="modal">
            <div className="modal-content">
              <h1>Add New User</h1>
              <span className="close" onClick={closeModal}>&times;</span>
              <form onSubmit={handleNewSubmit}>
                <div className="form-group">
                  <label htmlFor="id">Id:</label>
                  <input type="string" id="id" name="id" value={newUser.id} onChange={handleNewInputChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="first_name">First Name:</label>
                  <input type="text" id="first_name" name="first_name" value={newUser.first_name} onChange={handleNewInputChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="last_name">Last Name:</label>
                  <input type="text" id="last_name" name="last_name" value={newUser.last_name} onChange={handleNewInputChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input type="email" id="email" name="email" value={newUser.email} onChange={handleNewInputChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="avatar">Avatar:</label>
                  <select id="avatar" name="avatar" value={newUser.avatar} onChange={handleNewInputChange} required>
                    <option value="">Select Avatar</option>
                    <option value="https://robohash.org/sintessequaerat.png?size=50x50&set=set1">Avatar 1</option>
                    <option value="https://robohash.org/delectusconsectetursed.png?size=50x50&set=set1">Avatar 2</option>
                    <option value="https://robohash.org/temporibusporrolaboriosam.png?size=50x50&set=set1">Avatar 3</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="gender">Gender:</label>
                  <select id="gender" name="gender" value={newUser.gender} onChange={handleNewInputChange} required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="prefer not to say">prefer not to say</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="domain">Domain:</label>
                  <select id="domain" name="domain" value={newUser.domain} onChange={handleNewInputChange} required>
                    <option value="">Select Domain</option>
                    <option value="IT">IT</option>
                    <option value="Sales">Sales</option>
                    <option value="Finance">Finance</option>
                    {/* Add other domain options */}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="available">available:</label>
                  <select id="available" name="available" value={newUser.available} onChange={handleNewInputChange} required>
                    <option value="">Select available</option>
                    <option value={true}>True</option>
                    <option value={false}>False</option>
                  </select>
                </div>
                <button type="submit">Submit</button>
              </form>
            </div>
          </div>
          </div>
        )}
        {showEditModal && (
          <div className="user-overlay">
          <div className="modal">
            <div className="modal-content">
              <form onSubmit={handleEditSubmit}>
                <h1>Edit User</h1>
                <span className="close" onClick={closeModal}>&times;</span>
                <div className="form-group">
                  <label htmlFor="id">ID:</label>
                  <input type="id" id="id" name="id" value={editedUser.id} onChange={handleEditInputChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="first_name">First Name:</label>
                  <input type="text" id="first_name" name="first_name" value={editedUser.first_name} onChange={handleEditInputChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="last_name">Last Name:</label>
                  <input type="text" id="last_name" name="last_name" value={editedUser.last_name} onChange={handleEditInputChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input type="email" id="email" name="email" value={editedUser.email} onChange={handleEditInputChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="avatar">Avatar:</label>
                  <select id="avatar" name="avatar" value={editedUser.avatar} onChange={handleEditInputChange} required>
                    <option value="">Select Avatar</option>
                    <option value="https://robohash.org/sintessequaerat.png?size=50x50&set=set1">Avatar 1</option>
                    <option value="https://robohash.org/delectusconsectetursed.png?size=50x50&set=set1">Avatar 2</option>
                    <option value="https://robohash.org/temporibusporrolaboriosam.png?size=50x50&set=set1">Avatar 3</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="gender">Gender:</label>
                  <select id="gender" name="gender" value={editedUser.gender} onChange={handleEditInputChange} required>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="prefer not to say">Prefer Not to Say</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="domain">Domain:</label>
                  <select id="domain" name="domain" value={editedUser.domain} onChange={handleEditInputChange} required>
                    <option value="">Select Domain</option>
                    <option value="IT">IT</option>
                    <option value="Sales">Sales</option>
                    <option value="Finance">Finance</option>
                    {/* Add other domain options */}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="available">available:</label>
                  <select id="available" name="available" value={editedUser.available} onChange={handleEditInputChange} required>
                    <option value="">Select available</option>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </select>
                </div>
                {/* Add more fields for editing */}
                <div className="buttons">
                  <button type="submit">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
          </div>
        )}

         {showDeleteModal && (
          <div className="overlay">
           <div className="modal">
            <div className="modal-content">
              <h1>DELETE USER</h1>
              <span className="close" onClick={closeModal}>&times;</span>
              <div className="form-group">
                <label htmlFor="deleteEmail">Email:</label>
                <input type="email" id="deleteEmail" name="deleteEmail" value={deleteEmail} onChange={handleDeleteEmailChange} required />
              </div>
              <p>Are you sure you want to delete this user?</p>
              
              <button onClick={submitDeleteUser}>Delete</button>
            </div>
          </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
