import React, { useState, useEffect } from 'react';
import { Plus, X, Calendar, Building2 } from 'lucide-react';
import Modal from '../components/Modal';
import { applicationService } from '../services/storage';

const Applications = () => {
    const [applications, setApplications] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        company: '',
        role: '',
        status: 'applied',
        deadline: '',
        interviewDate: '',
        notes: '',
    });

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = () => {
        setApplications(applicationService.getAll());
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        applicationService.create(formData);
        setFormData({ company: '', role: '', status: 'applied', deadline: '', interviewDate: '', notes: '' });
        setIsModalOpen(false);
        loadApplications();
    };

    const handleDelete = (id) => {
        if (confirm('Delete this application?')) {
            applicationService.delete(id);
            loadApplications();
        }
    };

    const handleStatusChange = (id, newStatus) => {
        applicationService.update(id, { status: newStatus });
        loadApplications();
    };

    const getApplicationsByStatus = (status) => {
        return applications.filter(a => a.status === status);
    };

    const statuses = [
        { key: 'applied', label: 'Applied', color: 'primary' },
        { key: 'oa', label: 'OA', color: 'secondary' },
        { key: 'interview', label: 'Interview', color: 'warning' },
        { key: 'offer', label: 'Offer', color: 'success' },
        { key: 'rejected', label: 'Rejected', color: 'danger' },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold">Applications</h1>
                <button onClick={() => setIsModalOpen(true)} className="btn-primary">
                    <Plus size={20} />
                    Add Application
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {statuses.map(({ key, label, color }) => (
                    <div key={key} className={`card text-center bg-gradient-to-br from-accent-${color}/20 to-accent-${color}/5`}>
                        <p className="text-sm text-gray-400">{label}</p>
                        <p className="text-2xl font-bold mt-1">{getApplicationsByStatus(key).length}</p>
                    </div>
                ))}
            </div>

            {/* Pipeline Kanban */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 overflow-x-auto">
                {statuses.map(({ key, label, color }) => (
                    <div key={key} className="card min-w-[250px]">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold">{label}</h2>
                            <span className={`badge badge-${color}`}>
                                {getApplicationsByStatus(key).length}
                            </span>
                        </div>

                        <div className="space-y-3">
                            {getApplicationsByStatus(key).length === 0 ? (
                                <p className="text-xs text-gray-500 text-center py-4">No applications</p>
                            ) : (
                                getApplicationsByStatus(key).map(app => (
                                    <div key={app.id} className="glass rounded-lg p-3 space-y-2">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-sm">{app.company}</h3>
                                                <p className="text-xs text-gray-400">{app.role}</p>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(app.id)}
                                                className="text-gray-400 hover:text-accent-danger"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>

                                        {app.interviewDate && (
                                            <div className="flex items-center gap-1 text-xs text-accent-warning">
                                                <Calendar size={12} />
                                                {new Date(app.interviewDate).toLocaleDateString()}
                                            </div>
                                        )}

                                        {app.notes && (
                                            <p className="text-xs text-gray-400 line-clamp-2">{app.notes}</p>
                                        )}

                                        <select
                                            value={app.status}
                                            onChange={(e) => handleStatusChange(app.id, e.target.value)}
                                            className="input text-xs py-1 w-full"
                                        >
                                            {statuses.map(({ key, label }) => (
                                                <option key={key} value={key}>{label}</option>
                                            ))}
                                        </select>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Application">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Company *</label>
                            <input
                                type="text"
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                className="input"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Role *</label>
                            <input
                                type="text"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="input"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="input"
                        >
                            {statuses.map(({ key, label }) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Application Deadline</label>
                            <input
                                type="date"
                                value={formData.deadline}
                                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                className="input"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Interview Date</label>
                            <input
                                type="date"
                                value={formData.interviewDate}
                                onChange={(e) => setFormData({ ...formData, interviewDate: e.target.value })}
                                className="input"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Notes</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="input min-h-[80px]"
                            placeholder="Referral, recruiter contact, preparation notes..."
                            rows={3}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="submit" className="btn-primary flex-1">
                            Add Application
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

export default Applications;
