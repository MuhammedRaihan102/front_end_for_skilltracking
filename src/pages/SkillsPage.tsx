import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import SkillCard from '../components/SkillCard';
import SkillForm from '../components/SkillForm';
import { Skill } from '../types';

const SkillsPage = () => {
  const { skills, addSkill, deleteSkill } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterLevel, setFilterLevel] = useState('');

  // Get unique categories for filter
  const categories = Array.from(new Set(skills.map(skill => skill.category)));

  // Filter skills based on search and filters
  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory ? skill.category === filterCategory : true;
    const matchesLevel = filterLevel ? skill.level === filterLevel : true;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const handleAddSkill = (skillData: Omit<Skill, 'id'>) => {
    addSkill(skillData);
    setShowForm(false);
  };

  return (
    <div className="skills-page">
      <div className="container">
        <div className="page-header card">
          <div className="flex justify-between items-center">
            <h1>Your Skills</h1>
            <button onClick={() => setShowForm(true)}>Add New Skill</button>
          </div>
        </div>

        {showForm && (
          <div className="form-container">
            <SkillForm 
              onSubmit={handleAddSkill} 
              onCancel={() => setShowForm(false)} 
            />
          </div>
        )}

        <div className="filters card">
          <div className="flex gap-4">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="filter-select">
              <select 
                value={filterCategory} 
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filter-select">
              <select 
                value={filterLevel} 
                onChange={(e) => setFilterLevel(e.target.value)}
              >
                <option value="">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {filteredSkills.length > 0 ? (
          <div className="skills-grid grid">
            {filteredSkills.map(skill => (
              <SkillCard 
                key={skill.id} 
                skill={skill} 
                onDelete={deleteSkill} 
              />
            ))}
          </div>
        ) : (
          <div className="no-skills card">
            <p>No skills found. {skills.length > 0 ? 'Try adjusting your filters.' : 'Start by adding your first skill!'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsPage;