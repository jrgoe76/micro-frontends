import React from 'react';
import './TaskManager.css';

// This is our federated micro-frontend component
const TaskManager: React.FC = () => {
  const [count, setCount] = React.useState(0);
  const [todos, setTodos] = React.useState<string[]>([
    'Learn Module Federation',
    'Implement Remote Components',
    'Test Cross-App Communication'
  ]);

  const addTodo = () => {
    const newTodo = `Federated task ${Date.now()}`;
    setTodos([...todos, newTodo]);
  };

  return (
    <div className="task-manager-container">
      <div className="task-manager-header">
        <h1>🌐 Federated Task Manager</h1>
        <p>This component is loaded via Module Federation from a remote application</p>
        <div className="federation-badge">
          Remote App (Port 5081)
        </div>
      </div>
      
      <div className="task-manager-content">
        <div className="task-manager-stats">
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

        <div className="task-manager-todos">
          <h3>📝 Federated Task List</h3>
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
      
      <div className="task-manager-footer">
        <p>🚀 Loaded via Module Federation from remote-app1 (localhost:5081)</p>
        <p>✨ Shared React 19.1 instance with host application</p>
      </div>
    </div>
  );
};

export default TaskManager;
