import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import EntryCard from '../components/EntryCard';
import SkillForm from '../components/SkillForm';
import EntryForm from '../components/EntryForm';
import { LearningEntry } from '../types';

const SkillDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    skills, 
    entries, 
    getSkillById, 
    getEntriesBySkill, 
    updateSkill, 
    deleteSkill,
    addEntry,
    updateEntry,
    deleteEntry
  } = useAppContext();

  const [skill, setSkill] = useState(getSkillById(id || ''));
  const [skillEntries, setSkillEntries] = useState<LearningEntry[]>([]);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<LearningEntry | null>(null);

  useEffect(() => {
    if (id) {
      const foundSkill = getSkillById(id);
      if (foundSkill) {
        setSkill(foundSkill);
        setSkillEntries(getEntriesBySkill(id));
      } else {
        navigate('/skills');
      }
    }
  }, [id, skills, entries]);

  if (!skill) {
    return (
      <div className="container">
        <div className="card">
          <h2>Skill not found</h2>
          <Link to="/skills">
            <button>Back to Skills</button>
          </Link>
        </div>
      </div>
    );
  }

  const handleUpdateSkill = (updatedSkill: any) => {
    updateSkill(updatedSkill);
    setShowEditForm(false);
  };

  const handleDeleteSkill = () => {
    if (window.confirm('Are you sure you want to delete this skill? All related entries will also be deleted.')) {
      deleteSkill(skill.id);
      navigate('/skills');
    }
  };

  const handleAddEntry = (entryData: Omit<LearningEntry, 'id'>) => {
    addEntry(entryData);
    setShowEntryForm(false);
  };

  const handleUpdateEntry = (updatedEntry: LearningEntry) => {
    updateEntry(updatedEntry);
    setSelectedEntry(null);
  };

  const handleEditEntry = (entry: LearningEntry) => {
    setSelectedEntry(entry);
  };

  // Sort entries by date (newest first)
  const sortedEntries = [...skillEntries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Calculate total hours spent on this skill
  const totalHours = skillEntries.reduce((sum, entry) => sum + entry.duration, 0);

  return (
    <div className="skill-detail-page">
      <div className="container">
        {showEditForm ? (
          <div className="edit-form-container card">
            <SkillForm
              initialData={skill}
              onSubmit={handleUpdateSkill}
              onCancel={() => setShowEditForm(false)}
            />
          </div>
        ) : selectedEntry ? (
          <div className="edit-entry-form-container card">
            <EntryForm
              skills={skills}
              initialData={selectedEntry}
              onSubmit={handleUpdateEntry}
              onCancel={() => setSelectedEntry(null)}
            />
          </div>
        ) : showEntryForm ? (
          <div className="add-entry-form-container card">
            <EntryForm
              skills={skills}
              preSelectedSkillId={skill.id}
              onSubmit={handleAddEntry}
              onCancel={() => setShowEntryForm(false)}
            />
          </div>
        ) : (
          <>
            <div className="skill-header card">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <h1>{skill.name}</h1>
                    <span className={`badge ${skill.level}`}>{skill.level}</span>
                  </div>
                  <p>Category: {skill.category}</p>
                </div>
                <div className="actions flex gap-2">
                  <button onClick={() => setShowEditForm(true)}>Edit Skill</button>
                  <button className="danger" onClick={handleDeleteSkill}>Delete</button>
                </div>
              </div>
              
              <div className="skill-progress mt-4">
                <h3>Progress: {skill.progress}%</h3>
                <div className="progress-container">
                  <div 
                    className="progress-bar" 
                    style={{ width: `${skill.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="skill-stats mt-4">
                <div className="stats flex gap-4">
                  <div className="stat">
                    <h3>{skillEntries.length}</h3>
                    <p>Learning Entries</p>
                  </div>
                  <div className="stat">
                    <h3>{totalHours}</h3>
                    <p>Total Hours</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="entries-section card">
              <div className="flex justify-between items-center mb-4">
                <h2>Learning Entries</h2>
                <button onClick={() => setShowEntryForm(true)}>Add New Entry</button>
              </div>
              
              {sortedEntries.length > 0 ? (
                <div className="entries-list">
                  {sortedEntries.map(entry => (
                    <EntryCard
                      key={entry.id}
                      entry={entry}
                      onDelete={deleteEntry}
                      onEdit={handleEditEntry}
                    />
                  ))}
                </div>
              ) : (
                <p>No learning entries for this skill yet. Start tracking your progress!</p>
              )}
            </div>
          </>
        )}
        
        <div className="back-link mt-4">
          <Link to="/skills">
            <button className="secondary">Back to Skills</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SkillDetailPage;