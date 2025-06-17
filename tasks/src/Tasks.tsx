import React from 'react';

// This is our federated micro-frontend component
const Tasks: React.FC = () => {
  
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

  const removeTodo = (index: number) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  return (
    <div className="mf-container mf-container--tasks">
      <div className="mf-header">
        <h1>🌐 Federated Task Manager</h1>
        <p>This component is loaded via Module Federation from a remote application</p>
        <div className="mf-badge">
          Remote App (Port 5081)
        </div>
      </div>

      <div className="mf-content">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Button Clicks</h3>
            <div className="stat-number">{count}</div>
            <button
              onClick={() => setCount(count + 1)}
              className="mf-btn mf-btn--small"
            >
              Click Me!
            </button>
          </div>

          <div className="stat-card">
            <h3>Total Tasks</h3>
            <div className="stat-number">{todos.length}</div>
            <button
              onClick={addTodo}
              className="mf-btn mf-btn--small"
            >
              Add Task
            </button>
          </div>
        </div>

        <div className="glass-card">
          <h3>📝 Federated Task List</h3>
          <div className="mf-grid">
            {todos.map((todo, index) => (
              <div key={index} className="mf-item-card">
                <div className="mf-item-info">
                  <div className="mf-item-title">{todo}</div>
                </div>
                <button
                  onClick={() => removeTodo(index)}
                  className="mf-btn mf-btn--small mf-btn--danger"
                  aria-label={`Delete task: ${todo}`}
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mf-footer">
        <p>🚀 Loaded via Module Federation from tasks (localhost:5081)</p>
        <p>✨ Shared React 19.1 instance with host application</p>
      </div>
    </div>
  );
};

export default Tasks;
