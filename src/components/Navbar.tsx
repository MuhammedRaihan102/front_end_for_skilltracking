import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Navbar = () => {
  const { user } = useAppContext();
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-logo">
            <h1>SkillTracker</h1>
          </Link>
          <div className="navbar-links">
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
              Dashboard
            </Link>
            <Link to="/skills" className={location.pathname.includes('/skills') ? 'active' : ''}>
              Skills
            </Link>
            <Link to="/journal" className={location.pathname.includes('/journal') ? 'active' : ''}>
              Learning Journal
            </Link>
            <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>
              Profile
            </Link>
          </div>
          <div className="navbar-user">
            <span className="streak">🔥 {user.streak} day streak</span>
            <span className="user-name">{user.name}</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;