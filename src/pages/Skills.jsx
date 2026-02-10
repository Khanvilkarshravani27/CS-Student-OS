import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import Modal from '../components/Modal';
import { skillService } from '../services/storage';

const Skills = () => {
    const [skills, setSkills] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Web Development',
        progress: 0,
        stage: 'beginner',
        resources: '',
    });

    useEffect(() => {
        loadSkills();
    }, []);

    const loadSkills = () => {
        setSkills(skillService.getAll());
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const skillData = {
            ...formData,
            resources: formData.resources.split('\n').map(r => r.trim()).filter(r => r),
        };

        skillService.create(skillData);
        setFormData({ name: '', category: 'Web Development', progress: 0, stage: 'beginner', resources: '' });
        setIsModalOpen(false);
        loadSkills();
    };

    const handleProgressUpdate = (id, newProgress) => {
        skillService.update(id, { progress: parseInt(newProgress) });
        loadSkills();
    };

    const handleStageUpdate = (id, newStage) => {
        skillService.update(id, { stage: newStage });
        loadSkills();
    };

    const handleDelete = (id) => {
        if (confirm('Delete this skill?')) {
            skillService.delete(id);
            loadSkills();
        }
    };

    const getSkillsByCategory = (category) => {
        return skills.filter(s => s.category === category);
    };

    const categories = [
        'Web Development',
        'AI/ML',
        'Databases',
        'DevOps',
        'Mobile Development',
        'Other',
    ];

    const stageColors = {
        beginner: 'primary',
        intermediate: 'warning',
        advanced: 'success',
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold">Skills</h1>
                <button onClick={() => setIsModalOpen(true)} className="btn-primary">
                    <Plus size={20} />
                    Add Skill
                </button>
            </div>

            {/* Skills by Category */}
            {categories.map(category => {
                const categorySkills = getSkillsByCategory(category);
                if (categorySkills.length === 0) return null;

                return (
                    <div key={category} className="card">
                        <h2 className="text-2xl font-bold mb-4">{category}</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {categorySkills.map(skill => (
                                <div key={skill.id} className="glass rounded-lg p-4 space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg">{skill.name}</h3>
                                            <span className={`badge badge-${stageColors[skill.stage]} text-xs mt-1`}>
                                                {skill.stage}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(skill.id)}
                                            className="btn-danger text-sm p-2"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-gray-400">Progress</span>
                                            <span className="text-sm font-semibold">{skill.progress}%</span>
                                        </div>
                                        <div className="w-full bg-dark-border rounded-full h-2">
                                            <div
                                                className="bg-accent-primary h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${skill.progress}%` }}
                                            />
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={skill.progress}
                                            onChange={(e) => handleProgressUpdate(skill.id, e.target.value)}
                                            className="w-full mt-2 accent-accent-primary"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Stage</label>
                                        <select
                                            value={skill.stage}
                                            onChange={(e) => handleStageUpdate(skill.id, e.target.value)}
                                            className="input text-sm"
                                        >
                                            <option value="beginner">Beginner</option>
                                            <option value="intermediate">Intermediate</option>
                                            <option value="advanced">Advanced</option>
                                        </select>
                                    </div>

                                    {skill.resources && skill.resources.length > 0 && (
                                        <div>
                                            <p className="text-xs text-gray-400 mb-1">Resources:</p>
                                            <ul className="text-xs space-y-1">
                                                {skill.resources.map((resource, idx) => (
                                                    <li key={idx} className="text-gray-300 truncate">• {resource}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}

            {skills.length === 0 && (
                <div className="card text-center py-12">
                    <p className="text-gray-400">No skills added yet. Start tracking your learning journey!</p>
                </div>
            )}

            {/* Add Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Skill">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Skill Name *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="input"
                            placeholder="e.g., React, Python, Docker"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="input"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Current Stage</label>
                        <select
                            value={formData.stage}
                            onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                            className="input"
                        >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Progress (%)</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={formData.progress}
                            onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
                            className="input"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Learning Resources (one per line)</label>
                        <textarea
                            value={formData.resources}
                            onChange={(e) => setFormData({ ...formData, resources: e.target.value })}
                            className="input min-h-[100px]"
                            placeholder="Official Docs&#10;Udemy Course&#10;YouTube Tutorial"
                            rows={4}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="submit" className="btn-primary flex-1">
                            Add Skill
                        </button>
                        <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Skills;
