import React, { useState, useEffect } from 'react';
import { Plus, X, ExternalLink, Github } from 'lucide-react';
import Modal from '../components/Modal';
import { projectService } from '../services/storage';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        techStack: '',
        status: 'planned',
        githubLink: '',
        demoLink: '',
    });

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = () => {
        setProjects(projectService.getAll());
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const projectData = {
            ...formData,
            techStack: formData.techStack.split(',').map(t => t.trim()).filter(t => t),
        };

        if (editingProject) {
            projectService.update(editingProject.id, projectData);
        } else {
            projectService.create(projectData);
        }

        resetForm();
        loadProjects();
    };

    const resetForm = () => {
        setFormData({ name: '', description: '', techStack: '', status: 'planned', githubLink: '', demoLink: '' });
        setEditingProject(null);
        setIsModalOpen(false);
    };

    const handleEdit = (project) => {
        setEditingProject(project);
        setFormData({
            name: project.name,
            description: project.description || '',
            techStack: Array.isArray(project.techStack) ? project.techStack.join(', ') : '',
            status: project.status || 'planned',
            githubLink: project.githubLink || '',
            demoLink: project.demoLink || '',
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (confirm('Delete this project?')) {
            projectService.delete(id);
            loadProjects();
        }
    };

    const getProjectsByStatus = (status) => {
        return projects.filter(p => p.status === status);
    };

    const statuses = [
        { key: 'planned', label: 'Planned', color: 'primary' },
        { key: 'active', label: 'Active', color: 'warning' },
        { key: 'completed', label: 'Completed', color: 'success' },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold">Projects</h1>
                <button onClick={() => setIsModalOpen(true)} className="btn-primary">
                    <Plus size={20} />
                    Add Project
                </button>
            </div>

            {/* Kanban Board */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statuses.map(({ key, label, color }) => (
                    <div key={key} className="card">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">{label}</h2>
                            <span className={`badge badge-${color}`}>
                                {getProjectsByStatus(key).length}
                            </span>
                        </div>

                        <div className="space-y-3">
                            {getProjectsByStatus(key).length === 0 ? (
                                <p className="text-sm text-gray-400 text-center py-8">No projects</p>
                            ) : (
                                getProjectsByStatus(key).map(project => (
                                    <div key={project.id} className="glass-hover rounded-lg p-4 space-y-3">
                                        <h3 className="font-semibold">{project.name}</h3>

                                        {project.description && (
                                            <p className="text-sm text-gray-400">{project.description}</p>
                                        )}

                                        {project.techStack && project.techStack.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {project.techStack.map((tech, idx) => (
                                                    <span key={idx} className="badge badge-primary text-xs">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex gap-2 pt-2">
                                            {project.githubLink && (
                                                <a
                                                    href={project.githubLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-accent-primary hover:underline flex items-center gap-1"
                                                >
                                                    <Github size={14} />
                                                    GitHub
                                                </a>
                                            )}
                                            {project.demoLink && (
                                                <a
                                                    href={project.demoLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-accent-success hover:underline flex items-center gap-1"
                                                >
                                                    <ExternalLink size={14} />
                                                    Demo
                                                </a>
                                            )}
                                        </div>

                                        <div className="flex gap-2 pt-2 border-t border-dark-border">
                                            <button onClick={() => handleEdit(project)} className="btn-secondary text-xs flex-1">
                                                Edit
                                            </button>
                                            <button onClick={() => handleDelete(project.id)} className="btn-danger text-xs">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={resetForm}
                title={editingProject ? 'Edit Project' : 'Add New Project'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Project Name *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="input"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="input min-h-[100px]"
                            rows={4}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Tech Stack (comma-separated)</label>
                        <input
                            type="text"
                            value={formData.techStack}
                            onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                            className="input"
                            placeholder="React, Node.js, MongoDB"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="input"
                        >
                            <option value="planned">Planned</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">GitHub Link</label>
                            <input
                                type="url"
                                value={formData.githubLink}
                                onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                                className="input "
                                placeholder="https://github.com/..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Demo Link</label>
                            <input
                                type="url"
                                value={formData.demoLink}
                                onChange={(e) => setFormData({ ...formData, demoLink: e.target.value })}
                                className="input"
                                placeholder="https://demo.com"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="submit" className="btn-primary flex-1">
                            {editingProject ? 'Update Project' : 'Add Project'}
                        </button>
                        <button type="button" onClick={resetForm} className="btn-secondary">
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Projects;
