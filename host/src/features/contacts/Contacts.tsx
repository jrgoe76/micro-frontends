import React from 'react';
import type { Contact } from './Contact';

// This represents a different micro-frontend application
const Contacts: React.FC = () => {

  const [contacts, setContacts] = React.useState<Contact[]>([
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', profession: 'Engineer' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', profession: 'Sales Rep' },
    { id: 3, name: 'Carol Davis', email: 'carol@example.com', profession: 'Physician' }
  ]);

  const [newContact, setNewContact] = React.useState({ name: '', email: '', profession: 'Engineer' });
  
  const [searchTerm, setSearchTerm] = React.useState('');

  const addContact = () => {
    if (newContact.name && newContact.email) {
      const contact: Contact = {
        id: Date.now(),
        ...newContact
      };
      setContacts([...contacts, contact]);
      setNewContact({ name: '', email: '', profession: 'Engineer' });
    }
  };

  const deleteContact = (id: number) => {
    setContacts(contacts.filter(contact => contact.id !== id));
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) 
    ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) 
    ||
    contact.profession.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mf-container mf-container--contacts">
      <div className="mf-header">
        <h1>👥 Contact Management System</h1>
        <p>This is another dynamically loaded micro-frontend application</p>
        <div className="mf-badge">
          Local Dynamic Import
        </div>
      </div>

      <div className="mf-content">
        <div className="mf-form-section">
          <label htmlFor="search" className="mf-label">🔍 Search Contacts</label>
          <input
            id="search"
            type="text"
            placeholder="Search by name, email, or profession..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mf-input"
          />
        </div>

        <div className="mf-form-section">
          <h3>➕ Add New Contact</h3>
          <div className="mf-form-grid">
            <input
              type="text"
              placeholder="Full Name"
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              className="mf-input"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={newContact.email}
              onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
              className="mf-input"
            />
            <select
              value={newContact.profession}
              onChange={(e) => setNewContact({ ...newContact, profession: e.target.value })}
              className="mf-select"
            >
              <option value="Engineer">Engineer</option>
              <option value="Sales Rep">Sales Rep</option>
              <option value="Physician">Physician</option>
              <option value="Accountant">Accountant</option>
            </select>
            <button onClick={addContact} className="mf-btn">
              Add Contact
            </button>
          </div>
        </div>
      </div>

      <div className="mf-content">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Contacts</h3>
            <div className="stat-number">{contacts.length}</div>
          </div>
          <div className="stat-card">
            <h3>Filtered Results</h3>
            <div className="stat-number">{filteredContacts.length}</div>
          </div>
        </div>

        <div className="mf-grid mf-grid--auto-fit">
          {filteredContacts.map((contact) => (
            <div key={contact.id} className="mf-item-card">
              <div className="mf-item-info">
                <div className="mf-item-title">{contact.name}</div>
                <div className="mf-item-subtitle">{contact.email}</div>
                <div className="mf-item-meta">{contact.profession}</div>
              </div>
              <button
                onClick={() => deleteContact(contact.id)}
                className="mf-btn mf-btn--small mf-btn--danger"
                aria-label={`Delete contact ${contact.name}`}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mf-footer">
        <p>⚡ Dynamically loaded feauture with independent state management</p>
      </div>
    </div>
  );
};

export default Contacts;
