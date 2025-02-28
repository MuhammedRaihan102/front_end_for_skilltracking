import { useState, FormEvent, useEffect } from 'react';
import { LearningEntry, Skill } from '../types';

interface EntryFormProps {
  skills: Skill[];
  initialData?: LearningEntry;
  preSelectedSkillId?: string;
  onSubmit: (entry: Omit<LearningEntry, 'id'> | LearningEntry) => void;
  onCancel: () => void;
}

const EntryForm = ({ 
  skills, 
  initialData, 
  preSelectedSkillId,
  onSubmit, 
  onCancel 
}: EntryFormProps) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState(initialData?.duration || 1);
  const [skillId, setSkillId] = useState(initialData?.skillId || preSelectedSkillId || '');
  const [resources, setResources] = useState<string[]>(initialData?.resources || []);
  const [resourceInput, setResourceInput] = useState('');
  const [notes, setNotes] = useState(initialData?.notes || '');

  useEffect(() => {
    if (preSelectedSkillId) {
      setSkillId(preSelectedSkillId);
    }
  }, [preSelectedSkillId]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const entryData = {
      title,
      description,
      date,
      duration,
      skillId,
      resources,
      notes: notes.trim() ? notes : undefined,
    };
    
    if (initialData) {
      onSubmit({
        ...initialData,
        ...entryData,
      });
    } else {
      onSubmit(entryData);
    }
  };

  const addResource = () => {
    if (resourceInput.trim()) {
      setResources([...resources, resourceInput.trim()]);
      setResourceInput('');
    }
  };

  const removeResource = (index: number) => {
    setResources(resources.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="entry-form card">
      <h2>{initialData ? 'Edit Learning Entry' : 'Add New Learning Entry'}</h2>
      
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="What did you learn today?"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="skill">Related Skill</label>
        <select
          id="skill"
          value={skillId}
          onChange={(e) => setSkillId(e.target.value)}
          required
        >
          <option value="">Select a skill</option>
          {skills.map((skill) => (
            <option key={skill.id} value={skill.id}>
              {skill.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="date">Date</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="duration">Duration (hours)</label>
        <input
          type="number"
          id="duration"
          min="0.5"
          step="0.5"
          value={duration}
          onChange={(e) => setDuration(parseFloat(e.target.value))}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
          placeholder="Describe what you learned"
        ></textarea>
      </div>
      
      <div className="form-group">
        <label>Resources</label>
        <div className="resource-input flex gap-2">
          <input
            type="text"
            value={resourceInput}
            onChange={(e) => setResourceInput(e.target.value)}
            placeholder="Add a link or resource name"
          />
          <button type="button" onClick={addResource}>
            Add
          </button>
        </div>
        
        {resources.length > 0 && (
          <ul className="resource-list mt-2">
            {resources.map((resource, index) => (
              <li key={index} className="resource-item flex justify-between items-center">
                <span>{resource}</span>
                <button 
                  type="button" 
                  className="danger" 
                  onClick={() => removeResource(index)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="form-group">
        <label htmlFor="notes">Additional Notes</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Any additional thoughts or notes (optional)"
        ></textarea>
      </div>
      
      <div className="form-actions flex gap-2">
        <button type="submit">
          {initialData ? 'Update Entry' : 'Add Entry'}
        </button>
        <button type="button" className="secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EntryForm;