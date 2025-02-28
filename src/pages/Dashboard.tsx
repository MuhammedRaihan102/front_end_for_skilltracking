import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ProgressChart from '../components/ProgressChart';
import EntryCard from '../components/EntryCard';
import { LearningEntry } from '../types';

const Dashboard = () => {
  const { skills, entries, user, calculateTotalHours, deleteEntry } = useAppContext();
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<LearningEntry | null>(null);

  // Get recent entries (last 5)
  const recentEntries = [...entries]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Get top skills (highest progress)
  const topSkills = [...skills]
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 3);

  const handleEditEntry = (entry: LearningEntry) => {
    setSelectedEntry(entry);
    setShowEntryModal(true);
  };

  return (
    <div className="dashboard">
      <div className="container">
        <div className="welcome-section card">
          <h1>Welcome back, {user.name}!</h1>
          <p>You're on a {user.streak} day learning streak. Keep it up! 🔥</p>
          <div className="stats flex gap-4 mt-4">
            <div className="stat">
              <h3>{skills.length}</h3>
              <p>Skills Tracked</p>
            </div>
            <div className="stat">
              <h3>{entries.length}</h3>
              <p>Learning Entries</p>
            </div>
            <div className="stat">
              <h3>{calculateTotalHours()}</h3>
              <p>Total Hours</p>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="left-column">
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h2>Your Progress</h2>
                <Link to="/skills">
                  <button>Manage Skills</button>
                </Link>
              </div>
              {skills.length > 0 ? (
                <ProgressChart skills={skills} />
              ) : (
                <p>No skills added yet. Start by adding some skills!</p>
              )}
            </div>

            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h2>Top Skills</h2>
                <Link to="/skills">
                  <button>View All</button>
                </Link>
              </div>
              {topSkills.length > 0 ? (
                <div className="top-skills">
                  {topSkills.map(skill => (
                    <div key={skill.id} className="top-skill">
                      <div className="flex justify-between items-center">
                        <h3>{skill.name}</h3>
                        <span className={`badge ${skill.level}`}>{skill.level}</span>
                      </div>
                      <div className="progress-container mt-2">
                        <div 
                          className="progress-bar" 
                          style={{ width: `${skill.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-right mt-2">{skill.progress}%</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No skills added yet. Start by adding some skills!</p>
              )}
            </div>
          </div>

          <div className="right-column">
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h2>Recent Learning Activity</h2>
                <Link to="/journal">
                  <button>View Journal</button>
                </Link>
              </div>
              {recentEntries.length > 0 ? (
                <div className="recent-entries">
                  {recentEntries.map(entry => (
                    <EntryCard
                      key={entry.id}
                      entry={entry}
                      skill={skills.find(skill => skill.id === entry.skillId)}
                      onDelete={deleteEntry}
                      onEdit={handleEditEntry}
                    />
                  ))}
                </div>
              ) : (
                <p>No learning entries yet. Start by adding your first learning activity!</p>
              )}
              <div className="text-center mt-4">
                <Link to="/journal/new">
                  <button>Add New Entry</button>
                </Link>
              </div>
            </div>

            <div className="card">
              <h2>Your Learning Goals</h2>
              {user.goals.length > 0 ? (
                <ul className="goals-list">
                  {user.goals.map((goal, index) => (
                    <li key={index} className="goal-item">
                      {goal}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No goals set yet. Add some in your profile!</p>
              )}
              <div className="text-center mt-4">
                <Link to="/profile">
                  <button>Manage Goals</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;