import React from 'react';
import './App1.css';

// This represents a micro-frontend application
const App1: React.FC = () => {
  const [count, setCount] = React.useState(0);
  const [todos, setTodos] = React.useState<string[]>([
    'Learn Dynamic Module Loading',
    'Implement Module Federation',
    'Add React Router'
  ]);

  const addTodo = () => {
    const newTodo = `New task ${Date.now()}`;
    setTodos([...todos, newTodo]);
  };

  return (
    <div className="app1-container">
      <div className="app1-header">
        <h1>📋 Task Manager App</h1>
        <p>This is a dynamically loaded micro-frontend application</p>
      </div>
      
      <div className="app1-content">
        <div className="app1-stats">
          <div className="stat-card">
            <h3>Button Clicks</h3>
            <div className="stat-number">{count}</div>
            <button 
              onClick={() => setCount(count + 1)}
              className="stat-button"
            >
              Click Me!
            </button>
          </div>
          
          <div className="stat-card">
            <h3>Total Tasks</h3>
            <div className="stat-number">{todos.length}</div>
            <button 
              onClick={addTodo}
              className="stat-button"
            >
              Add Task
            </button>
          </div>
        </div>

        <div className="app1-todos">
          <h3>📝 Task List</h3>
          <ul className="todo-list">
            {todos.map((todo, index) => (
              <li key={index} className="todo-item">
                <span className="todo-text">{todo}</span>
                <button 
                  onClick={() => setTodos(todos.filter((_, i) => i !== index))}
                  className="todo-delete"
                  aria-label={`Delete task: ${todo}`}
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="app1-footer">
        <p>🚀 Loaded dynamically via import() statement</p>
      </div>
    </div>
  );
};

export default App1;
