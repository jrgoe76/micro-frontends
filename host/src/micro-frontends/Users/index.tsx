import React from 'react';

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
    <div className="mf-container mf-container--users">
      <div className="mf-header">
        <h1>👥 User Management System</h1>
        <p>This is another dynamically loaded micro-frontend application</p>
        <div className="mf-badge">
          Local Dynamic Import
        </div>
      </div>

      <div className="mf-content">
        <div className="mf-form-section">
          <label htmlFor="search" className="mf-label">🔍 Search Users</label>
          <input
            id="search"
            type="text"
            placeholder="Search by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mf-input"
          />
        </div>

        <div className="mf-form-section">
          <h3>➕ Add New User</h3>
          <div className="mf-form-grid">
            <input
              type="text"
              placeholder="Full Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="mf-input"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="mf-input"
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="mf-select"
            >
              <option value="Developer">Developer</option>
              <option value="Designer">Designer</option>
              <option value="Manager">Manager</option>
              <option value="Analyst">Analyst</option>
            </select>
            <button onClick={addUser} className="mf-btn">
              Add User
            </button>
          </div>
        </div>
      </div>

      <div className="mf-content">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Users</h3>
            <div className="stat-number">{users.length}</div>
          </div>
          <div className="stat-card">
            <h3>Filtered Results</h3>
            <div className="stat-number">{filteredUsers.length}</div>
          </div>
        </div>

        <div className="mf-grid mf-grid--auto-fit">
          {filteredUsers.map((user) => (
            <div key={user.id} className="mf-item-card">
              <div className="mf-item-info">
                <div className="mf-item-title">{user.name}</div>
                <div className="mf-item-subtitle">{user.email}</div>
                <div className="mf-item-meta">{user.role}</div>
              </div>
              <button
                onClick={() => deleteUser(user.id)}
                className="mf-btn mf-btn--small mf-btn--danger"
                aria-label={`Delete user ${user.name}`}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mf-footer">
        <p>⚡ Dynamically loaded micro-frontend with independent state management</p>
      </div>
    </div>
  );
};

export default Users;
