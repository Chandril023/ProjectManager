import React from 'react';
import './myprofile.css'; // Import CSS file for styling

const MyProfile = () => {
    return (
        <div className="my-profile-container">
            {/* User Card */}
            <div className="my-profile-user-card">
                {/* Background Image */}
                <div className="my-profile-background-image"></div>
                {/* User Avatar */}
                <div className="my-profile-user-avatar">
                    {/* User Avatar Image */}
                    <img src="https://miro.medium.com/v2/resize:fit:828/format:webp/1*ooOH6jo8I0ns0J-BE0SAow.jpeg" alt="User Avatar" />
                </div>
                {/* User Name */}
                <div className="my-profile-user-name">John Doe</div>
                {/* Navigation Links */}
                <div className="my-profile-navigation-links">
                    <div className="link">Home</div>
                    <div className="link active">My Profile</div>
                    <div className="link">My Teams</div>
                </div>
            </div>
            {/* Profile Form */}
            <div className="my-profile-form">
                {/* Form Title */}
                <h2>Profile Information</h2>
                {/* Form Fields */}
                <div className="my-profile-form-field">
                    <label>First Name:</label>
                    <input type="text" value="John" readOnly />
                </div>
                <div className="my-profile-form-field">
                    <label>Last Name:</label>
                    <input type="text" value="Doe" readOnly />
                </div>
                <div className="my-profile-form-field">
                    <label>Email:</label>
                    <input type="email" value="john.doe@example.com" readOnly />
                </div>
                <div className="my-profile-form-field">
                    <label>Domain:</label>
                    <input type="text" value="example.com" readOnly />
                </div>
                <div className="my-profile-form-field">
                    <label>Gender:</label>
                    <input type="text" value="Male" readOnly />
                </div>
                <div className="my-profile-form-field">
                    <label>Available:</label>
                    <input type="text" value="Yes" readOnly />
                </div>
                {/* Edit Button */}
                <button>Edit Information</button>
            </div>
        </div>
    );
}

export default MyProfile;
