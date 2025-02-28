import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import EntryForm from '../components/EntryForm';
import { LearningEntry } from '../types';

const NewEntryPage = () => {
  const { skills, addEntry } = useAppContext();
  const navigate = useNavigate();

  const handleAddEntry = (entryData: Omit<LearningEntry, 'id'>) => {
    addEntry(entryData);
    navigate('/journal');
  };

  return (
    <div className="new-entry-page">
      <div className="container">
        <div className="page-header card">
          <h1>Add New Learning Entry</h1>
        </div>

        <EntryForm
          skills={skills}
          onSubmit={handleAddEntry}
          onCancel={() => navigate('/journal')}
        />
      </div>
    </div>
  );
};

export default NewEntryPage;