import React, { useState, useEffect } from 'react';
import { Plus, X, BookOpen, Building2 } from 'lucide-react';
import Modal from '../components/Modal';
import { interviewService } from '../services/storage';

const InterviewPrep = () => {
    const [questions, setQuestions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [typeFilter, setTypeFilter] = useState('all');
    const [formData, setFormData] = useState({
        question: '',
        type: 'technical',
        company: '',
        answer: '',
    });

    useEffect(() => {
        loadQuestions();
        initializeDefaultQuestions();
    }, []);

    const initializeDefaultQuestions = () => {
        const existing = interviewService.getAll();
        if (existing.length === 0) {
            // Add sample STAR method questions
            const defaultQuestions = [
                {
                    question: 'Tell me about yourself',
                    type: 'behavioral',
                    company: 'General',
                    answer: 'Use this space to craft your elevator pitch...',
                },
                {
                    question: 'Why do you want to work here?',
                    type: 'behavioral',
                    company: 'General',
                    answer: 'Research the company and align your answer...',
                },
                {
                    question: 'Describe a challenging project you worked on',
                    type: 'behavioral',
                    company: 'General',
                    answer: 'Use STAR method: Situation, Task, Action, Result',
                },
                {
                    question: 'Explain the difference between var, let, and const in JavaScript',
                    type: 'technical',
                    company: 'General',
                    answer: '',
                },
            ];

            defaultQuestions.forEach(q => interviewService.create(q));
        }
    };

    const loadQuestions = () => {
        setQuestions(interviewService.getAll());
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        interviewService.create(formData);
        setFormData({ question: '', type: 'technical', company: '', answer: '' });
        setIsModalOpen(false);
        loadQuestions();
    };

    const handleDelete = (id) => {
        if (confirm('Delete this question?')) {
            interviewService.delete(id);
            loadQuestions();
        }
    };

    const handleAnswerUpdate = (id, answer) => {
        interviewService.update(id, { answer });
        loadQuestions();
    };

    const getFilteredQuestions = () => {
        if (typeFilter === 'all') return questions;
        return questions.filter(q => q.type === typeFilter);
    };

    const filteredQuestions = getFilteredQuestions();

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold">Interview Prep</h1>
                <button onClick={() => setIsModalOpen(true)} className="btn-primary">
                    <Plus size={20} />
                    Add Question
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card text-center">
                    <p className="text-sm text-gray-400">Total Questions</p>
                    <p className="text-3xl font-bold mt-1">{questions.length}</p>
                </div>
                <div className="card text-center bg-gradient-to-br from-accent-primary/20 to-accent-primary/5">
                    <p className="text-sm text-gray-400">Technical</p>
                    <p className="text-3xl font-bold mt-1">
                        {questions.filter(q => q.type === 'technical').length}
                    </p>
                </div>
                <div className="card text-center bg-gradient-to-br from-accent-secondary/20 to-accent-secondary/5">
                    <p className="text-sm text-gray-400">Behavioral</p>
                    <p className="text-3xl font-bold mt-1">
                        {questions.filter(q => q.type === 'behavioral').length}
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                {['all', 'technical', 'behavioral'].map((type) => (
                    <button
                        key={type}
                        onClick={() => setTypeFilter(type)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${typeFilter === type
                                ? 'bg-accent-primary text-white'
                                : 'glass-hover'
                            }`}
                    >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                ))}
            </div>

            {/* Questions List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredQuestions.length === 0 ? (
                    <div className="col-span-2 card text-center py-12">
                        <p className="text-gray-400">No questions yet. Add some to prepare for interviews!</p>
                    </div>
                ) : (
                    filteredQuestions.map(question => (
                        <div key={question.id} className="card space-y-3">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`badge ${question.type === 'technical' ? 'badge-primary' : 'badge-secondary'
                                            }`}>
                                            {question.type}
                                        </span>
                                        {question.company && (
                                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                                <Building2 size={12} />
                                                {question.company}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-semibold">{question.question}</h3>
                                </div>
                                <button
                                    onClick={() => handleDelete(question.id)}
                                    className="btn-danger text-sm"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Your Answer</label>
                                <textarea
                                    value={question.answer || ''}
                                    onChange={(e) => handleAnswerUpdate(question.id, e.target.value)}
                                    className="input min-h-[120px] text-sm"
                                    placeholder={
                                        question.type === 'behavioral'
                                            ? 'Use STAR method:\nSituation: ...\nTask: ...\nAction: ...\nResult: ...'
                                            : 'Write your technical explanation...'
                                    }
                                    rows={5}
                                />
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Interview Question">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Question *</label>
                        <textarea
                            value={formData.question}
                            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                            className="input min-h-[80px]"
                            required
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="input"
                            >
                                <option value="technical">Technical</option>
                                <option value="behavioral">Behavioral</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Company (Optional)</label>
                            <input
                                type="text"
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                className="input"
                                placeholder="Google, Amazon, etc."
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Your Answer (Optional)</label>
                        <textarea
                            value={formData.answer}
                            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                            className="input min-h-[100px]"
                            placeholder="You can add your answer later"
                            rows={4}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="submit" className="btn-primary flex-1">
                            Add Question
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

export default InterviewPrep;
