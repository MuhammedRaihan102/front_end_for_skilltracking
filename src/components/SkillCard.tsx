import { Link } from 'react-router-dom';
import { Skill } from '../types';

interface SkillCardProps {
  skill: Skill;
  onDelete: (id: string) => void;
}

const SkillCard = ({ skill, onDelete }: SkillCardProps) => {
  return (
    <div className="card skill-card">
      <div className="flex justify-between items-center mb-2">
        <h3>{skill.name}</h3>
        <span className={`badge ${skill.level}`}>{skill.level}</span>
      </div>
      <p className="mb-2">Category: {skill.category}</p>
      <div className="progress-container mb-4">
        <div 
          className="progress-bar" 
          style={{ width: `${skill.progress}%` }}
          title={`${skill.progress}% progress`}
        ></div>
      </div>
      <div className="flex justify-between">
        <Link to={`/skills/${skill.id}`}>
          <button>View Details</button>
        </Link>
        <button 
          className="danger" 
          onClick={() => onDelete(skill.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default SkillCard;