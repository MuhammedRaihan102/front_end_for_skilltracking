import { useState, FormEvent } from 'react';
import { Skill } from '../types';

interface SkillFormProps {
  initialData?: Skill;
  onSubmit: (skill: Omit<Skill, 'id'> | Skill) => void;
  onCancel: () => void;
}

const SkillForm = ({ initialData, onSubmit, onCancel }: SkillFormProps) => {
  const [name, setName] = useState(initialData?.name || '');
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>(
    initialData?.level || 'beginner'
  );
  const [category, setCategory] = useState(initialData?.category || '');
  const [progress, setProgress] = useState(initialData?.progress || 0);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (initialData) {
      onSubmit({
        ...initialData,
        name,
        level,
        category,
        progress,
      });
    } else {
      onSubmit({
        name,
        level,
        category,
        progress,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="skill-form card">
      <h2>{initialData ? 'Edit Skill' : 'Add New Skill'}</h2>
      
      <div className="form-group">
        <label htmlFor="name">Skill Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="e.g., React, JavaScript, UI Design"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="level">Skill Level</label>
        <select
          id="level"
          value={level}
          onChange={(e) => setLevel(e.target.value as 'beginner' | 'intermediate' | 'advanced')}
          required
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="category">Category</label>
        <input
          type="text"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          placeholder="e.g., Frontend, Backend, Design"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="progress">Initial Progress ({progress}%)</label>
        <input
          type="range"
          id="progress"
          min="0"
          max="100"
          value={progress}
          onChange={(e) => setProgress(parseInt(e.target.value))}
        />
      </div>
      
      <div className="form-actions flex gap-2">
        <button type="submit">{initialData ? 'Update Skill' : 'Add Skill'}</button>
        <button type="button" className="secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default SkillForm;