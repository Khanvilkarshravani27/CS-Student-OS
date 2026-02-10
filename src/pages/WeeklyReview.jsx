import React, { useState, useEffect } from 'react';
import { Plus, Calendar } from 'lucide-react';
import Modal from '../components/Modal';
import { weeklyReviewService, taskService, dsaService, projectService } from '../services/storage';

const WeeklyReview = () => {
    const [reviews, setReviews] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [autoStats, setAutoStats] = useState({});
    const [formData, setFormData] = useState({
        weekOf: '',
        wins: '',
        challenges: '',
        learnings: '',
        nextSteps: '',
    });

    useEffect(() => {
        loadReviews();
        calculateAutoStats();

        // Set current week
        const today = new Date();
        const monday = new Date(today);
        monday.setDate(today.getDate() - today.getDay() + 1);
        setFormData(prev => ({ ...prev, weekOf: monday.toISOString().split('T')[0] }));
    }, []);

    const loadReviews = () => {
        setReviews(weeklyReviewService.getAll());
    };

    const calculateAutoStats = () => {
        const tasks = taskService.getAll();
        const completedTasks = tasks.filter(t => t.completed).length;

        const dsaProblems = dsaService.getAll();
        const masteredProblems = dsaProblems.filter(p => p.status === 'mastered').length;

        const projects = projectService.getAll();
        const activeProjects = projects.filter(p => p.status === 'active').length;

        setAutoStats({
            tasksCompleted: completedTasks,
            dsaSolved: masteredProblems,
            activeProjects,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        weeklyReviewService.create({ ...formData, stats: autoStats });
        setFormData({ weekOf: '', wins: '', challenges: '', learnings: '', nextSteps: '' });
        setIsModalOpen(false);
        loadReviews();
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold">Weekly Review</h1>
                <button onClick={() => setIsModalOpen(true)} className="btn-primary">
                    <Plus size={20} />
                    New Review
                </button>
            </div>

            {/* This Week's Stats */}
            <div className="card">
                <h2 className="text-2xl font-bold mb-4">This Week's Progress</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="glass rounded-lg p-4 text-center">
                        <p className="text-sm text-gray-400">Tasks Completed</p>
                        <p className="text-3xl font-bold mt-1 text-accent-success">{autoStats.tasksCompleted}</p>
                    </div>
                    <div className="glass rounded-lg p-4 text-center">
                        <p className="text-sm text-gray-400">DSA Problems Solved</p>
                        <p className="text-3xl font-bold mt-1 text-accent-primary">{autoStats.dsaSolved}</p>
                    </div>
                    <div className="glass rounded-lg p-4 text-center">
                        <p className="text-sm text-gray-400">Active Projects</p>
                        <p className="text-3xl font-bold mt-1 text-accent-warning">{autoStats.activeProjects}</p>
                    </div>
                </div>
            </div>

            {/* Past Reviews */}
            <div>
                <h2 className="text-2xl font-bold mb-4">Past Reviews</h2>
                {reviews.length === 0 ? (
                    <div className="card text-center py-12">
                        <p className="text-gray-400">No weekly reviews yet. Create one to start reflecting!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reviews.sort((a, b) => new Date(b.weekOf) - new Date(a.weekOf)).map(review => (
                            <div key={review.id} className="card">
                                <div className="flex items-center gap-2 mb-4">
                                    <Calendar size={20} className="text-accent-primary" />
                                    <h3 className="text-xl font-bold">
                                        Week of {new Date(review.weekOf).toLocaleDateString()}
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-semibold text-accent-success mb-2">🎉 Wins</h4>
                                        <p className="text-gray-300 whitespace-pre-wrap">{review.wins}</p>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-accent-warning mb-2">💪 Challenges</h4>
                                        <p className="text-gray-300 whitespace-pre-wrap">{review.challenges}</p>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-accent-primary mb-2">💡 Learnings</h4>
                                        <p className="text-gray-300 whitespace-pre-wrap">{review.learnings}</p>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-accent-secondary mb-2">🎯 Next Steps</h4>
                                        <p className="text-gray-300 whitespace-pre-wrap">{review.nextSteps}</p>
                                    </div>
                                </div>

                                {review.stats && (
                                    <div className="mt-4 pt-4 border-t border-dark-border">
                                        <p className="text-sm text-gray-400">
                                            Stats: {review.stats.tasksCompleted} tasks • {review.stats.dsaSolved} DSA problems • {review.stats.activeProjects} active projects
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Weekly Review" size="lg">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Week of *</label>
                        <input
                            type="date"
                            value={formData.weekOf}
                            onChange={(e) => setFormData({ ...formData, weekOf: e.target.value })}
                            className="input"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">🎉 Wins *</label>
                        <textarea
                            value={formData.wins}
                            onChange={(e) => setFormData({ ...formData, wins: e.target.value })}
                            className="input min-h-[100px]"
                            placeholder="What went well this week? What are you proud of?"
                            required
                            rows={4}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">💪 Challenges *</label>
                        <textarea
                            value={formData.challenges}
                            onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                            className="input min-h-[100px]"
                            placeholder="What was difficult? What obstacles did you face?"
                            required
                            rows={4}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">💡 Learnings *</label>
                        <textarea
                            value={formData.learnings}
                            onChange={(e) => setFormData({ ...formData, learnings: e.target.value })}
                            className="input min-h-[100px]"
                            placeholder="What did you learn? Key takeaways?"
                            required
                            rows={4}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">🎯 Next Steps *</label>
                        <textarea
                            value={formData.nextSteps}
                            onChange={(e) => setFormData({ ...formData, nextSteps: e.target.value })}
                            className="input min-h-[100px]"
                            placeholder="What will you focus on next week?"
                            required
                            rows={4}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="submit" className="btn-primary flex-1">
                            Create Review
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

export default WeeklyReview;
