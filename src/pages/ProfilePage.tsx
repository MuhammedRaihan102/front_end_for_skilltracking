import { useState, FormEvent } from 'react';
import { useAppContext } from '../context/AppContext';

const ProfilePage = () => {
  const { user, updateUser, calculateTotalHours } = useAppContext();
  
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [goals, setGoals] = useState<string[]>(user.goals);
  const [newGoal, setNewGoal] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    updateUser({
      ...user,
      name,
      email,
      goals,
    });
    
    setIsEditing(false);
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      setGoals([...goals, newGoal.trim()]);
      setNewGoal('');
    }
  };

  const removeGoal = (index: number) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="page-header card">
          <h1>Your Profile</h1>
        </div>

        {isEditing ? (
          <div className="profile-edit card">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Learning Goals</label>
                <div className="goal-input flex gap-2">
                  <input
                    type="text"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    placeholder="Add a new learning goal"
                  />
                  <button type="button" onClick={addGoal}>
                    Add
                  </button>
                </div>
                
                {goals.length > 0 && (
                  <ul className="goals-list mt-2">
                    {goals.map((goal, index) => (
                      <li key={index} className="goal-item flex justify-between items-center">
                        <span>{goal}</span>
                        <button 
                          type="button" 
                          className="danger" 
                          onClick={() => removeGoal(index)}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              <div className="form-actions flex gap-2">
                <button type="submit">Save Changes</button>
                <button 
                  type="button" 
                  className="secondary" 
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="profile-info card">
              <div className="flex justify-between items-center mb-4">
                <h2>Personal Information</h2>
                <button onClick={() => setIsEditing(true)}>Edit Profile</button>
              </div>
              
              <div className="info-item">
                <h3>Name</h3>
                <p>{user.name}</p>
              </div>
              
              <div className="info-item">
                <h3>Email</h3>
                <p>{user.email}</p>
              </div>
              
              <div className="info-item">
                <h3>Current Streak</h3>
                <p>{user.streak} days 🔥</p>
              </div>
              
              <div className="info-item">
                <h3>Total Learning Hours</h3>
                <p>{calculateTotalHours()} hours</p>
              </div>
            </div>
            
            <div className="goals card">
              <div className="flex justify-between items-center mb-4">
                <h2>Learning Goals</h2>
                <button onClick={() => setIsEditing(true)}>Edit Goals</button>
              </div>
              
              {goals.length > 0 ? (
                <ul className="goals-list">
                  {goals.map((goal, index) => (
                    <li key={index} className="goal-item">
                      {goal}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No learning goals set yet. Add some to track your progress!</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;