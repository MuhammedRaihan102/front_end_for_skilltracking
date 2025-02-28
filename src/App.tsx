import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import SkillsPage from './pages/SkillsPage';
import SkillDetailPage from './pages/SkillDetailPage';
import JournalPage from './pages/JournalPage';
import NewEntryPage from './pages/NewEntryPage';
import ProfilePage from './pages/ProfilePage';
import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/skills" element={<SkillsPage />} />
              <Route path="/skills/:id" element={<SkillDetailPage />} />
              <Route path="/journal" element={<JournalPage />} />
              <Route path="/journal/new" element={<NewEntryPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;