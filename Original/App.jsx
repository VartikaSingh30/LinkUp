import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/profile.css';

// Lazy load components to catch errors
import Home from './pages/Home';
import Chat from './pages/Chat';
import Network from './pages/Network';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/network" element={<Network />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
