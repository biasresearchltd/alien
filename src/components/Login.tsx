import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AnimatedText from './AnimatedText';
import AnimatedList from './AnimatedList';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }
    
    try {
      const success = await login(username, password);
      if (success) {
        navigate('/');
      } else {
        setError('Invalid username or password.');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="login-container">
      <AnimatedList staggerDelay={0.05}>
        <div className="form-header">
          <h2><AnimatedText text="Login to Alien" preserveWhitespace={true} /></h2>
          <p><AnimatedText text="Enter your credentials to access member features" preserveWhitespace={true} /></p>
        </div>
        
        {error && (
          <div className="error-message">
            <AnimatedText text={error} preserveWhitespace={true} />
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">
              <AnimatedText text="Username:" preserveWhitespace={true} />
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">
              <AnimatedText text="Password:" preserveWhitespace={true} />
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="form-input"
            />
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              disabled={isLoading} 
              className="submit-button"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
        
        <div className="form-footer">
          <p>
            <AnimatedText 
              text="Demo credentials: username: admin, password: password123" 
              delay={800}
              preserveWhitespace={true}
            />
          </p>
        </div>
      </AnimatedList>
    </div>
  );
};

export default Login; 