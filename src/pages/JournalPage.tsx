import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import EntryCard from '../components/EntryCard';
import EntryForm from '../components/EntryForm';
import { LearningEntry } from '../types';

const JournalPage = () => {
  const { entries, skills, deleteEntry, updateEntry } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSkill, setFilterSkill] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<LearningEntry | null>(null);

  // Filter entries based on search and filters
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = 
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSkill = filterSkill ? entry.skillId === filterSkill : true;
    
    const entryDate = new Date(entry.date);
    const matchesDateFrom = filterDateFrom 
      ? entryDate >= new Date(filterDateFrom) 
      : true;
    
    const matchesDateTo = filterDateTo 
      ? entryDate <= new Date(filterDateTo) 
      : true;
    
    return matchesSearch && matchesSkill && matchesDateFrom && matchesDateTo;
  });

  // Sort entries by date (newest first)
  const sortedEntries = [...filteredEntries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleEditEntry = (entry: LearningEntry) => {
    setSelectedEntry(entry);
  };

  const handleUpdateEntry = (updatedEntry: LearningEntry) => {
    updateEntry(updatedEntry);
    setSelectedEntry(null);
  };

  return (
    <div className="journal-page">
      <div className="container">
        <div className="page-header card">
          <div className="flex justify-between items-center">
            <h1>Learning Journal</h1>
            <Link to="/journal/new">
              <button>Add New Entry</button>
            </Link>
          </div>
        </div>

        {selectedEntry ? (
          <div className="edit-form-container">
            <EntryForm
              skills={skills}
              initialData={selectedEntry}
              onSubmit={handleUpdateEntry}
              onCancel={() => setSelectedEntry(null)}
            />
          </div>
        ) : (
          <>
            <div className="filters card">
              <div className="flex gap-4 flex-col">
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="Search entries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-4">
                  <div className="filter-select">
                    <select 
                      value={filterSkill} 
                      onChange={(e) => setFilterSkill(e.target.value)}
                    >
                      <option value="">All Skills</option>
                      {skills.map(skill => (
                        <option key={skill.id} value={skill.id}>
                          {skill.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="date-filter">
                    <label>From:</label>
                    <input
                      type="date"
                      value={filterDateFrom}
                      onChange={(e) => setFilterDateFrom(e.target.value)}
                    />
                  </div>
                  
                  <div className="date-filter">
                    <label>To:</label>
                    <input
                      type="date"
                      value={filterDateTo}
                      onChange={(e) => setFilterDateTo(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {sortedEntries.length > 0 ? (
              <div className="entries-list">
                {sortedEntries.map(entry => (
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
              <div className="no-entries card">
                <p>No entries found. {entries.length > 0 ? 'Try adjusting your filters.' : 'Start by adding your first learning entry!'}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default JournalPage;