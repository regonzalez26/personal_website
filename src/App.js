import './App.css';

import './assets/fonts/cs-gordon-serif.otf'
import './assets/fonts/glacial-indifference.otf'

import HomePage from './pages/home/Home';
import BlogPage from './pages/blog/BlogPage';
import ContactPage from './pages/contact/ContactPage';
import GamePage from './pages/games/GamePage';

import NavigationPanel from './navigation-panel/NavigationPanel';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavigationPanel />
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/games" element={<GamePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
