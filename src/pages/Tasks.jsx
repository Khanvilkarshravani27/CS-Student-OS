import React, { useState, useEffect } from 'react';
import { Plus, X, Calendar, Flag } from 'lucide-react';
import Modal from '../components/Modal';
import { taskService } from '../services/storage';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filter, setFilter] = useState('all'); // all, today, week, completed
    const [editingTask, setEditingTask] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium',
        deadline: '',
    });

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = () => {
        setTasks(taskService.getAll());
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingTask) {
            taskService.update(editingTask.id, formData);
        } else {
            taskService.create(formData);
        }

        resetForm();
        loadTasks();
    };

    const resetForm = () => {
        setFormData({ title: '', description: '', priority: 'medium', deadline: '' });
        setEditingTask(null);
        setIsModalOpen(false);
    };

    const handleEdit = (task) => {
        setEditingTask(task);
        setFormData({
            title: task.title,
            description: task.description || '',
            priority: task.priority || 'medium',
            deadline: task.deadline || '',
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (confirm('Delete this task?')) {
            taskService.delete(id);
            loadTasks();
        }
    };

    const handleToggle = (id) => {
        taskService.toggle(id);
        loadTasks();
    };

    const getFilteredTasks = () => {
        const today = new Date().toISOString().split('T')[0];
        const oneWeekFromNow = new Date();
        oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
        const oneWeekStr = oneWeekFromNow.toISOString().split('T')[0];

        switch (filter) {
            case 'today':
                return tasks.filter(t => t.deadline && t.deadline.startsWith(today) && !t.completed);
            case 'week':
                return tasks.filter(t => t.deadline && t.deadline <= oneWeekStr && !t.completed);
            case 'completed':
                return tasks.filter(t => t.completed);
            default:
                return tasks;
        }
    };

    const filteredTasks = getFilteredTasks();

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold">Tasks</h1>
                <button onClick={() => setIsModalOpen(true)} className="btn-primary">
                    <Plus size={20} />
                    Add Task
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                {['all', 'today', 'week', 'completed'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === f
                                ? 'bg-accent-primary text-white'
                                : 'glass-hover'
                            }`}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {/* Tasks List */}
            <div className="space-y-3">
                {filteredTasks.length === 0 ? (
                    <div className="card text-center py-12">
                        <p className="text-gray-400">No tasks found. Add one to get started!</p>
                    </div>
                ) : (
                    filteredTasks.map(task => (
                        <div key={task.id} className="card-hover flex items-start gap-4">
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => handleToggle(task.id)}
                                className="mt-1 w-5 h-5 rounded accent-accent-primary cursor-pointer"
                            />

                            <div className="flex-1">
                                <h3 className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-500' : ''}`}>
                                    {task.title}
                                </h3>
                                {task.description && (
                                    <p className="text-sm text-gray-400 mt-1">{task.description}</p>
                                )}
                                <div className="flex items-center gap-3 mt-2">
                                    {task.deadline && (
                                        <div className="flex items-center gap-1 text-xs text-gray-400">
                                            <Calendar size={14} />
                                            {new Date(task.deadline).toLocaleDateString()}
                                        </div>
                                    )}
                                    {task.priority && (
                                        <span className={`badge badge-${task.priority === 'high' ? 'danger' :
                                                task.priority === 'medium' ? 'warning' :
                                                    'primary'
                                            }`}>
                                            <Flag size={12} />
                                            {task.priority}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(task)} className="btn-secondary text-sm">
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(task.id)} className="btn-danger text-sm">
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={resetForm}
                title={editingTask ? 'Edit Task' : 'Add New Task'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Title *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Priority</label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                className="input"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Deadline</label>
                            <input
                                type="date"
                                value={formData.deadline}
                                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                className="input"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="submit" className="btn-primary flex-1">
                            {editingTask ? 'Update Task' : 'Add Task'}
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

export default Tasks;
