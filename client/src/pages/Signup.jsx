import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(name, email, password);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)] p-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[var(--card-bg)] rounded-2xl shadow-xl p-8 border border-[var(--border-color)]"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[var(--text-main)]">Create Account</h1>
          <p className="text-[var(--text-muted)] mt-2">Start tracking your expenses today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-color)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-color)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-color)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-[var(--accent-color)] text-white py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
          Already have an account? <Link to="/login" className="text-[var(--accent-color)] hover:underline">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
