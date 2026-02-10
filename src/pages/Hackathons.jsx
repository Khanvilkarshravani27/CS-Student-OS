import React, { useState, useEffect } from 'react';
import { Trophy, Users, Calendar, Award, Plus, Edit2, Trash2, ExternalLink, Lightbulb, Share2, Building } from 'lucide-react';
import Modal from '../components/Modal';
import { hackathonService } from '../services/storage';

const Hackathons = () => {
    const [hackathons, setHackathons] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingHackathon, setEditingHackathon] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [formData, setFormData] = useState({
        name: '',
        startDate: '',
        endDate: '',
        organizer: '',
        team: '',
        project: '',
        status: 'upcoming',
        outcome: '',
        prize: '',
        learnings: '',
        linkedinPost: '',
        portfolioLink: '',
        notes: '',
        link: '',
    });

    useEffect(() => {
        loadHackathons();
    }, []);

    const loadHackathons = () => {
        setHackathons(hackathonService.getAll());
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingHackathon) {
            hackathonService.update(editingHackathon.id, formData);
        } else {
            hackathonService.create(formData);
        }
        loadHackathons();
        resetForm();
    };

    const handleEdit = (hackathon) => {
        setEditingHackathon(hackathon);
        setFormData({
            name: hackathon.name,
            startDate: hackathon.startDate,
            endDate: hackathon.endDate,
            organizer: hackathon.organizer || '',
            team: hackathon.team || '',
            project: hackathon.project || '',
            status: hackathon.status,
            outcome: hackathon.outcome || '',
            prize: hackathon.prize || '',
            learnings: hackathon.learnings || '',
            linkedinPost: hackathon.linkedinPost || '',
            portfolioLink: hackathon.portfolioLink || '',
            notes: hackathon.notes || '',
            link: hackathon.link || '',
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Delete this hackathon?')) {
            hackathonService.delete(id);
            loadHackathons();
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            startDate: '',
            endDate: '',
            organizer: '',
            team: '',
            project: '',
            status: 'upcoming',
            outcome: '',
            prize: '',
            learnings: '',
            linkedinPost: '',
            portfolioLink: '',
            notes: '',
            link: '',
        });
        setEditingHackathon(null);
        setIsModalOpen(false);
    };

    const getFilteredHackathons = () => {
        if (filterStatus === 'all') return hackathons;
        return hackathons.filter(h => h.status === filterStatus);
    };

    const getStatusColor = (status) => {
        const colors = {
            upcoming: 'accent-primary',
            ongoing: 'accent-warning',
            completed: 'accent-success',
        };
        return colors[status] || 'accent-primary';
    };

    const getStats = () => {
        return {
            total: hackathons.length,
            upcoming: hackathons.filter(h => h.status === 'upcoming').length,
            ongoing: hackathons.filter(h => h.status === 'ongoing').length,
            completed: hackathons.filter(h => h.status === 'completed').length,
            prizes: hackathons.filter(h => h.prize && h.prize.trim() !== '').length,
        };
    };

    const stats = getStats();

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold">Hackathons</h1>
                <button onClick={() => setIsModalOpen(true)} className="btn-primary">
                    <Plus size={20} /> Add Hackathon
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="card text-center">
                    <p className="text-sm text-gray-400">Total</p>
                    <p className="text-3xl font-bold mt-1">{stats.total}</p>
                </div>
                <div className="card text-center">
                    <p className="text-sm text-gray-400">Upcoming</p>
                    <p className="text-3xl font-bold mt-1 text-accent-primary">{stats.upcoming}</p>
                </div>
                <div className="card text-center">
                    <p className="text-sm text-gray-400">Ongoing</p>
                    <p className="text-3xl font-bold mt-1 text-accent-warning">{stats.ongoing}</p>
                </div>
                <div className="card text-center">
                    <p className="text-sm text-gray-400">Completed</p>
                    <p className="text-3xl font-bold mt-1 text-accent-success">{stats.completed}</p>
                </div>
                <div className="card text-center">
                    <p className="text-sm text-gray-400">Prizes Won</p>
                    <p className="text-3xl font-bold mt-1 text-accent-warning">{stats.prizes}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
                {['all', 'upcoming', 'ongoing', 'completed'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${filterStatus === status
                            ? 'bg-accent-primary text-white'
                            : 'bg-dark-surface text-gray-400 hover:bg-dark-border'
                            }`}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                ))}
            </div>

            {/* Hackathons Grid */}
            {getFilteredHackathons().length === 0 ? (
                <div className="card text-center py-12">
                    <Trophy className="mx-auto text-gray-600 mb-4" size={48} />
                    <p className="text-gray-400">No hackathons yet. Add your first one!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {getFilteredHackathons().map(hackathon => (
                        <div key={hackathon.id} className="card hover:border-accent-primary/50 transition-all group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Trophy className={`text-${getStatusColor(hackathon.status)}`} size={24} />
                                        <h3 className="text-xl font-bold">{hackathon.name}</h3>
                                    </div>
                                    <span className={`badge badge-${hackathon.status === 'completed' ? 'success' :
                                        hackathon.status === 'ongoing' ? 'warning' :
                                            'primary'
                                        }`}>
                                        {hackathon.status}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(hackathon)} className="btn-secondary p-2">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(hackathon.id)} className="btn-secondary p-2 hover:bg-red-500/20">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {/* Organizer */}
                                {hackathon.organizer && (
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <Building size={16} />
                                        <span>{hackathon.organizer}</span>
                                    </div>
                                )}

                                {/* Dates */}
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <Calendar size={16} />
                                    <span>
                                        {new Date(hackathon.startDate).toLocaleDateString()} - {new Date(hackathon.endDate).toLocaleDateString()}
                                    </span>
                                </div>

                                {/* Outcome Badge */}
                                {hackathon.outcome && (
                                    <div className={`inline-flex items-center gap-2  px-3 py-1.5 rounded-lg text-sm font-semibold ${hackathon.outcome === 'won' ? 'bg-accent-warning/20 text-accent-warning border border-accent-warning/30' :
                                        hackathon.outcome === 'selected' ? 'bg-accent-success/20 text-accent-success border border-accent-success/30' :
                                            hackathon.outcome === 'not_selected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                                'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                        }`}>
                                        {hackathon.outcome === 'won' && '🏆 Won / Placed'}
                                        {hackathon.outcome === 'selected' && '✅ Selected'}
                                        {hackathon.outcome === 'not_selected' && '❌ Not Selected'}
                                        {hackathon.outcome === 'participated' && '🎯 Participated'}
                                    </div>
                                )}

                                {/* Team */}
                                {hackathon.team && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Users size={16} className="text-accent-secondary" />
                                        <span className="text-gray-300">{hackathon.team}</span>
                                    </div>
                                )}

                                {/* Project */}
                                {hackathon.project && (
                                    <div className="p-3 glass rounded-lg">
                                        <p className="text-xs text-gray-400 mb-1">Project</p>
                                        <p className="text-sm font-semibold">{hackathon.project}</p>
                                    </div>
                                )}

                                {/* Prize */}
                                {hackathon.prize && (
                                    <div className="flex items-center gap-2 p-3 glass rounded-lg border border-accent-warning/30">
                                        <Award size={16} className="text-accent-warning" />
                                        <span className="text-sm font-semibold text-accent-warning">{hackathon.prize}</span>
                                    </div>
                                )}

                                {/* Learnings */}
                                {hackathon.learnings && (
                                    <div className="p-3 glass rounded-lg border border-accent-success/30">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Lightbulb size={14} className="text-accent-success" />
                                            <p className="text-xs text-accent-success font-semibold uppercase tracking-wide">Key Learnings</p>
                                        </div>
                                        <p className="text-sm text-gray-300 line-clamp-3">{hackathon.learnings}</p>
                                    </div>
                                )}

                                {/* Notes */}
                                {hackathon.notes && (
                                    <p className="text-sm text-gray-400 line-clamp-2">{hackathon.notes}</p>
                                )}

                                {/* Links Section */}
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {hackathon.linkedinPost && (
                                        <a
                                            href={hackathon.linkedinPost}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-600/30 transition-colors border border-blue-600/30"
                                        >
                                            <Share2 size={12} />
                                            LinkedIn Post
                                        </a>
                                    )}
                                    {hackathon.portfolioLink && (
                                        <a
                                            href={hackathon.portfolioLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-primary/20 text-accent-primary rounded-lg text-xs font-medium hover:bg-accent-primary/30 transition-colors border border-accent-primary/30"
                                        >
                                            <ExternalLink size={12} />
                                            Portfolio
                                        </a>
                                    )}
                                    {hackathon.link && (
                                        <a
                                            href={hackathon.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600/20 text-purple-400 rounded-lg text-xs font-medium hover:bg-purple-600/30 transition-colors border border-purple-600/30"
                                        >
                                            <ExternalLink size={12} />
                                            Devpost
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            <Modal isOpen={isModalOpen} onClose={resetForm} title={editingHackathon ? 'Edit Hackathon' : 'Add New Hackathon'} size="lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-accent-primary uppercase tracking-wide">
                            <Trophy size={16} />
                            <span>Basic Information</span>
                        </div>
                        <div className="glass p-4 rounded-lg space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Hackathon Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="input-field"
                                    required
                                    placeholder="e.g., MLH Hackathon 2024"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                        <Building size={14} className="text-accent-primary" />
                                        Organizer / Platform
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.organizer}
                                        onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                                        className="input-field"
                                        placeholder="e.g., MLH, Devfolio, HackerEarth"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Status *</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="input-field"
                                        required
                                    >
                                        <option value="upcoming">🔵 Upcoming</option>
                                        <option value="ongoing">🟡 Ongoing</option>
                                        <option value="completed">🟢 Completed</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Start Date *</label>
                                    <input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="input-field"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">End Date *</label>
                                    <input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className="input-field"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Outcome & Results Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-accent-warning uppercase tracking-wide">
                            <Award size={16} />
                            <span>Outcome & Results</span>
                        </div>
                        <div className="glass p-4 rounded-lg space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Participation Outcome</label>
                                    <select
                                        value={formData.outcome}
                                        onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
                                        className="input-field"
                                    >
                                        <option value="">Not applicable yet</option>
                                        <option value="selected">✅ Selected</option>
                                        <option value="not_selected">❌ Not Selected</option>
                                        <option value="won">🏆 Won / Placed</option>
                                        <option value="participated">🎯 Participated / Lost</option>
                                    </select>
                                    <p className="text-xs text-gray-500 mt-1">Track your selection and results</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                        <Award size={14} className="text-accent-warning" />
                                        Prize / Award
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.prize}
                                        onChange={(e) => setFormData({ ...formData, prize: e.target.value })}
                                        className="input-field"
                                        placeholder="1st Place, Best AI Project, $500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Team & Project Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-accent-secondary uppercase tracking-wide">
                            <Users size={16} />
                            <span>Team & Project Details</span>
                        </div>
                        <div className="glass p-4 rounded-lg space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                        <Users size={14} className="text-accent-secondary" />
                                        Team Members
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.team}
                                        onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                                        className="input-field"
                                        placeholder="John, Sarah, Mike"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                        <Trophy size={14} className="text-accent-primary" />
                                        Project Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.project}
                                        onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                                        className="input-field"
                                        placeholder="AI-Powered Study Assistant"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Learnings & Reflection Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-accent-success uppercase tracking-wide">
                            <Lightbulb size={16} />
                            <span>Learnings & Reflection</span>
                        </div>
                        <div className="glass p-4 rounded-lg space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                    <Lightbulb size={14} className="text-accent-success" />
                                    What did you learn?
                                </label>
                                <textarea
                                    value={formData.learnings}
                                    onChange={(e) => setFormData({ ...formData, learnings: e.target.value })}
                                    className="input-field"
                                    rows="4"
                                    placeholder="Key learnings, skills applied, challenges overcome, improvements made, new technologies learned..."
                                />
                                <p className="text-xs text-gray-500 mt-1">Reflect on your growth and skills development</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Additional Notes</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="input-field"
                                    rows="2"
                                    placeholder="Tech stack, team dynamics, interesting moments..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Visibility & Links Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-indigo-400 uppercase tracking-wide">
                            <Share2 size={16} />
                            <span>Visibility & Links</span>
                        </div>
                        <div className="glass p-4 rounded-lg space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                    <Share2 size={14} className="text-blue-400" />
                                    LinkedIn Post Link
                                </label>
                                <input
                                    type="url"
                                    value={formData.linkedinPost}
                                    onChange={(e) => setFormData({ ...formData, linkedinPost: e.target.value })}
                                    className="input-field"
                                    placeholder="https://linkedin.com/posts/..."
                                />
                                <p className="text-xs text-gray-500 mt-1">Share your journey and achievements publicly</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                    <ExternalLink size={14} className="text-accent-primary" />
                                    Portfolio / Project Link
                                </label>
                                <input
                                    type="url"
                                    value={formData.portfolioLink}
                                    onChange={(e) => setFormData({ ...formData, portfolioLink: e.target.value })}
                                    className="input-field"
                                    placeholder="https://your-portfolio.com/project"
                                />
                                <p className="text-xs text-gray-500 mt-1">Your portfolio, website, or case study</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                    <ExternalLink size={14} className="text-purple-400" />
                                    Devpost / Demo Link
                                </label>
                                <input
                                    type="url"
                                    value={formData.link}
                                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                    className="input-field"
                                    placeholder="https://devpost.com/software/..."
                                />
                                <p className="text-xs text-gray-500 mt-1">Project submission, GitHub, or live demo</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2 border-t border-dark-border">
                        <button type="submit" className="btn-primary flex-1">
                            <Trophy size={18} />
                            {editingHackathon ? 'Update' : 'Add'} Hackathon
                        </button>
                        <button type="button" onClick={resetForm} className="btn-secondary px-6">
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Hackathons;
