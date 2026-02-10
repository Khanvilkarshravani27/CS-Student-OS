import React, { useState, useEffect } from 'react';
import { Plus, X, Flame, CheckCircle2 } from 'lucide-react';
import Modal from '../components/Modal';
import { habitService } from '../services/storage';

const Habits = () => {
    const [habits, setHabits] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '', frequency: 'daily' });

    useEffect(() => {
        loadHabits();
    }, []);

    const loadHabits = () => {
        setHabits(habitService.getAll());
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        habitService.create(formData);
        setFormData({ name: '', description: '', frequency: 'daily' });
        setIsModalOpen(false);
        loadHabits();
    };

    const handleToggleToday = (id) => {
        habitService.toggleToday(id);
        loadHabits();
    };

    const handleDelete = (id) => {
        if (confirm('Delete this habit?')) {
            habitService.delete(id);
            loadHabits();
        }
    };

    const getTodayStatus = (habit) => {
        const today = new Date().toISOString().split('T')[0];
        return habit.completions && habit.completions[today];
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold">Habits</h1>
                <button onClick={() => setIsModalOpen(true)} className="btn-primary">
                    <Plus size={20} />
                    Add Habit
                </button>
            </div>

            {/* Today's Habits */}
            <div className="card">
                <h2 className="text-2xl font-bold mb-4">Today's Checklist</h2>

                {habits.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No habits yet. Add one to start building consistency!</p>
                ) : (
                    <div className="space-y-3">
                        {habits.map(habit => (
                            <div
                                key={habit.id}
                                className="glass-hover rounded-lg p-4 flex items-center gap-4 cursor-pointer"
                                onClick={() => handleToggleToday(habit.id)}
                            >
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${getTodayStatus(habit)
                                        ? 'bg-accent-success border-accent-success'
                                        : 'border-gray-500'
                                    }`}>
                                    {getTodayStatus(habit) && <CheckCircle2 size={18} className="text-white" />}
                                </div>

                                <div className="flex-1">
                                    <h3 className="font-semibold">{habit.name}</h3>
                                    {habit.description && (
                                        <p className="text-sm text-gray-400">{habit.description}</p>
                                    )}
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-center">
                                        <div className="flex items-center gap-1 text-accent-warning">
                                            <Flame size={20} />
                                            <span className="text-2xl font-bold">{habit.streak || 0}</span>
                                        </div>
                                        <p className="text-xs text-gray-400">day streak</p>
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(habit.id);
                                        }}
                                        className="btn-danger text-sm"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card text-center">
                    <p className="text-sm text-gray-400">Total Habits</p>
                    <p className="text-3xl font-bold mt-2">{habits.length}</p>
                </div>
                <div className="card text-center bg-gradient-to-br from-accent-success/20 to-accent-success/5">
                    <p className="text-sm text-gray-400">Completed Today</p>
                    <p className="text-3xl font-bold mt-2">
                        {habits.filter(h => getTodayStatus(h)).length} / {habits.length}
                    </p>
                </div>
                <div className="card text-center bg-gradient-to-br from-accent-warning/20 to-accent-warning/5">
                    <p className="text-sm text-gray-400">Longest Streak</p>
                    <p className="text-3xl font-bold mt-2">
                        {habits.reduce((max, h) => Math.max(max, h.streak || 0), 0)} days
                    </p>
                </div>
            </div>

            {/* Add Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Habit">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Habit Name *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="input"
                            placeholder="e.g., Solve 2 DSA problems"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="input min-h-[80px]"
                            placeholder="Why is this habit important?"
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Frequency</label>
                        <select
                            value={formData.frequency}
                            onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                            className="input"
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                        </select>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="submit" className="btn-primary flex-1">
                            Add Habit
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

export default Habits;
