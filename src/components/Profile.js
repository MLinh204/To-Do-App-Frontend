import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSpring, animated } from 'react-spring';
import { useNavigate } from 'react-router-dom';

function Profile({ mode }) {
    const { user, updateProfile, refreshUser } = useAuth();
    const [username, setUsername] = useState(user?.username || '');
    const [email, setEmail] = useState(user?.email || '');
    const [profilePicture, setProfilePicture] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setUsername(user.username || '');
            setEmail(user.email || '');
        }
    }, [user]);

    const handleSubmit = async (e) => {
        console.log('Form submitted');
        e.preventDefault();
        if (mode !== 'update') {
            console.log(mode);
            return;
        }

        const updatedUsername = username.trim() || user.username;
        const updatedEmail = email.trim() || user.email;
        const updatedPassword = user.password;

        if (!updatedEmail || !updatedUsername) {
            alert('Username and Email cannot be empty');
            return;
        }

        const formData = new FormData();
        formData.append('username', updatedUsername);
        formData.append('email', updatedEmail);
        formData.append('password', updatedPassword);
        if (profilePicture) formData.append('profilePicture', profilePicture);

        console.log('FormData values:', { username: updatedUsername, email: updatedEmail });
        try {
            await updateProfile(formData, user.id);
            alert('Profile updated successfully');
            refreshUser();
            navigate('/profile/view');

        } catch (error) {
            console.error('Profile update failed:', error);
            alert('Profile update failed. Please try again.');
        }
    };

    const animation = useSpring({
        from: { opacity: 0, transform: 'scale(0.9)' },
        to: { opacity: 1, transform: 'scale(1)' },
    });

    if (!user) return <div>Please log in to view your profile.</div>;

    return (
        <animated.div style={animation}>
          <h2 className="page-title">
            {mode === 'view' ? 'View Profile' : 'Update Profile'}
          </h2>
          {mode === 'view' ? (
            <div className="profile-card">
              {user.profilePicture ? (
                <img
                  src={`${user.profilePicture}`}
                  alt="Profile"
                  onError={(e) => console.error('Image load error:', e)}
                />
              ) : (
                <p className="no-profile-picture">
                  You haven't set up a profile picture yet!
                </p>
              )}
              <div className='content'>
              <h3 style={{
                fontSize: '20px',
                margin: '5px 0 20px',
                fontWeight: 'normal',
              }}>
                <div className='info'>
                <strong>Username:</strong><br />
                <p className='info-text'>{user.username}</p>
                </div>
              </h3>
              <h4 style={{
                fontSize: '20px',
                margin: '5px 0 20px',
                fontWeight: 'normal',
              }}>
                <div className='info'>
                <strong>Email:</strong> 
                <p className='info-text'>{user.email}</p>
                </div>
              </h4>
              </div>
              
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="form-container">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfilePicture(e.target.files[0])}
              />
              {user.profilePicture ? (
                <img
                  src={`${user.profilePicture}`}
                  alt="Profile"
                  onError={(e) => console.error('Image load error:', e)}
                />
              ) : (
                <p className="no-profile-picture">
                  No profile picture set
                </p>
              )}
              <button type="submit">Update Profile</button>
            </form>
          )}
        </animated.div>
      );
}

export default Profile;