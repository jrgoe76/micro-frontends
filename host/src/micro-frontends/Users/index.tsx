import React from 'react';
import './Users.css';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

// This represents a different micro-frontend application
const Users: React.FC = () => {
  const [users, setUsers] = React.useState<User[]>([
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Developer' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Designer' },
    { id: 3, name: 'Carol Davis', email: 'carol@example.com', role: 'Manager' }
  ]);

  const [newUser, setNewUser] = React.useState({ name: '', email: '', role: 'Developer' });
  const [searchTerm, setSearchTerm] = React.useState('');

  const addUser = () => {
    if (newUser.name && newUser.email) {
      const user: User = {
        id: Date.now(),
        ...newUser
      };
      setUsers([...users, user]);
      setNewUser({ name: '', email: '', role: 'Developer' });
    }
  };

  const deleteUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="users-container">
      <div className="users-header">
        <h1>👥 User Management System</h1>
        <p>This is another dynamically loaded micro-frontend application</p>
      </div>

      <div className="users-controls">
        <div className="search-section">
          <label htmlFor="search" className="search-label">🔍 Search Users</label>
          <input
            id="search"
            type="text"
            placeholder="Search by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="add-user-section">
          <h3>➕ Add New User</h3>
          <div className="add-user-form">
            <input
              type="text"
              placeholder="Full Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="form-input"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="form-input"
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="form-select"
            >
              <option value="Developer">Developer</option>
              <option value="Designer">Designer</option>
              <option value="Manager">Manager</option>
              <option value="Analyst">Analyst</option>
            </select>
            <button onClick={addUser} className="add-button">
              Add User
            </button>
          </div>
        </div>
      </div>

      <div className="users-content">
        <div className="users-stats">
          <div className="stat-item">
            <span className="stat-label">Total Users:</span>
            <span className="stat-value">{users.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Filtered Results:</span>
            <span className="stat-value">{filteredUsers.length}</span>
          </div>
        </div>

        <div className="users-grid">
          {filteredUsers.map((user) => (
            <div key={user.id} className="user-card">
              <div className="user-info">
                <h4 className="user-name">{user.name}</h4>
                <p className="user-email">{user.email}</p>
                <span className="user-role">{user.role}</span>
              </div>
              <button
                onClick={() => deleteUser(user.id)}
                className="delete-button"
                aria-label={`Delete user ${user.name}`}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="users-footer">
        <p>⚡ Dynamically loaded micro-frontend with independent state management</p>
      </div>
    </div>
  );
};

export default Users;
