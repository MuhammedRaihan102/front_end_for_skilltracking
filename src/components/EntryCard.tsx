import { LearningEntry, Skill } from '../types';

interface EntryCardProps {
  entry: LearningEntry;
  skill?: Skill;
  onDelete: (id: string) => void;
  onEdit: (entry: LearningEntry) => void;
}

const EntryCard = ({ entry, skill, onDelete, onEdit }: EntryCardProps) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="card entry-card">
      <div className="flex justify-between items-center mb-2">
        <h3>{entry.title}</h3>
        <span className="date">{formatDate(entry.date)}</span>
      </div>
      {skill && (
        <div className="skill-tag mb-2">
          <span className={`badge ${skill.level}`}>{skill.name}</span>
        </div>
      )}
      <p className="description mb-2">{entry.description}</p>
      <p className="duration mb-4">Duration: {entry.duration} hours</p>
      
      {entry.resources && entry.resources.length > 0 && (
        <div className="resources mb-2">
          <h4>Resources:</h4>
          <ul>
            {entry.resources.map((resource, index) => (
              <li key={index}>{resource}</li>
            ))}
          </ul>
        </div>
      )}
      
      {entry.notes && (
        <div className="notes mb-4">
          <h4>Notes:</h4>
          <p>{entry.notes}</p>
        </div>
      )}
      
      <div className="flex justify-between">
        <button onClick={() => onEdit(entry)}>Edit</button>
        <button 
          className="danger" 
          onClick={() => onDelete(entry.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default EntryCard;