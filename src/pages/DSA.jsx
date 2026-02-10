import React, { useState, useEffect } from 'react';
import { Search, Filter, ExternalLink, StickyNote, Download, CheckSquare } from 'lucide-react';
import Modal from '../components/Modal';
import { dsaService } from '../services/storage';
import striversA2ZSheet from '../data/strivers-a2z';

const DSA = () => {
    const [problems, setProblems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [topicFilter, setTopicFilter] = useState('all');
    const [difficultyFilter, setDifficultyFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [notes, setNotes] = useState('');
    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedForExport, setSelectedForExport] = useState(new Set());

    useEffect(() => {
        initializeData();
    }, []);

    const initializeData = () => {
        // Initialize with Striver's sheet if empty
        const existing = dsaService.getAll();
        if (existing.length === 0) {
            dsaService.initializeWithStrivers(striversA2ZSheet);
        }
        loadProblems();
    };

    const loadProblems = () => {
        setProblems(dsaService.getAll());
    };

    const updateStatus = (id, status) => {
        dsaService.update(id, { status });
        loadProblems();
        if (selectedProblem && selectedProblem.id === id) {
            setSelectedProblem({ ...selectedProblem, status });
        }
    };

    const saveNotes = () => {
        if (selectedProblem) {
            dsaService.update(selectedProblem.id, { notes });
            loadProblems();
            setSelectedProblem(null);
        }
    };

    const openProblemModal = (problem) => {
        setSelectedProblem(problem);
        setNotes(problem.notes || '');
    };

    const toggleSelection = (problemId) => {
        const newSelection = new Set(selectedForExport);
        if (newSelection.has(problemId)) {
            newSelection.delete(problemId);
        } else {
            newSelection.add(problemId);
        }
        setSelectedForExport(newSelection);
    };

    const toggleSelectionMode = () => {
        setSelectionMode(!selectionMode);
        setSelectedForExport(new Set());
    };

    const exportToPDF = (exportAll = false) => {
        const problemsToExport = exportAll
            ? problems.filter(p => p.notes && p.notes.trim() !== '')
            : problems.filter(p => selectedForExport.has(p.id));

        if (problemsToExport.length === 0) {
            alert(exportAll ? 'No problems with notes found!' : 'Please select at least one problem to export!');
            return;
        }

        // Create HTML content for PDF
        let htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>DSA Notes - ${new Date().toLocaleDateString()}</title>
                <style>
                    body {  font-family: Arial, sans-serif;
                        margin: 40px;
                        line-height: 1.6;
                    }
                    h1 {
                        color: #6366f1;
                        border-bottom: 3px solid #6366f1;
                        padding-bottom: 10px;
                    }
                    .problem {
                        margin: 30px 0;
                        page-break-inside: avoid;
                        border: 1px solid #e5e7eb;
                        padding: 20px;
                        border-radius: 8px;
                    }
                    .problem-header {
                        background: #f3f4f6;
                        padding: 15px;
                        margin: -20px -20px 15px -20px;
                        border-radius: 8px 8px 0 0;
                    }
                    .problem-title {
                        font-size: 20px;
                        font-weight: bold;
                        color: #1f2937;
                        margin-bottom: 8px;
                    }
                    .problem-meta {
                        font-size: 14px;
                        color: #6b7280;
                    }
                    .badge {
                        display: inline-block;
                        padding: 4px 12px;
                        border-radius: 12px;
                        font-size: 12px;
                        margin-right: 8px;
                        font-weight: 600;
                    }
                    .badge-easy { background: #d1fae5; color: #065f46; }
                    .badge-medium { background: #fef3c7; color: #92400e; }
                    .badge-hard { background: #fee2e2; color: #991b1b; }
                    .notes {
                        white-space: pre-wrap;
                        background: #f9fafb;
                        padding: 15px;
                        border-left: 4px solid #6366f1;
                        margin-top: 15px;
                        font-size: 14px;
                    }
                    .leetcode-link {
                        color: #6366f1;
                        text-decoration: none;
                        font-size: 13px;
                    }
                    @media print {
                        body { margin: 20px; }
                        .problem { page-break-inside: avoid; }
                    }
                </style>
            </head>
            <body>
                <h1>🚀 DSA Study Notes</h1>
                <p style="color: #6b7280; margin-bottom: 30px;">
                    Generated on: ${new Date().toLocaleString()} | Total Problems: ${problemsToExport.length}
                </p>
        `;

        problemsToExport.forEach((problem, index) => {
            htmlContent += `
                <div class="problem">
                    <div class="problem-header">
                        <div class="problem-title">${index + 1}. ${problem.name}</div>
                        <div class="problem-meta">
                            <span class="badge badge-${problem.difficulty}">${problem.difficulty.toUpperCase()}</span>
                            <span style="margin-right: 10px;">Topic: ${problem.topic}</span>
                            ${problem.leetcodeLink ? `<a href="${problem.leetcodeLink}" class="leetcode-link" target="_blank">🔗 LeetCode</a>` : ''}
                        </div>
                    </div>
                    ${problem.notes ? `<div class="notes">${problem.notes}</div>` : '<div class="notes"><em>No notes yet</em></div>'}
                </div>
            `;
        });

        htmlContent += `
            </body>
            </html>
        `;

        // Create a Blob and trigger download
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `DSA-Notes-${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Reset selection mode
        if (!exportAll) {
            setSelectionMode(false);
            setSelectedForExport(new Set());
        }

        alert(`Successfully exported ${problemsToExport.length} problem notes! The file will open in your browser where you can save it as PDF (Ctrl+P → Save as PDF).`);
    };

    const getFilteredProblems = () => {
        return problems.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesTopic = topicFilter === 'all' || p.topic === topicFilter;
            const matchesDifficulty = difficultyFilter === 'all' || p.difficulty === difficultyFilter;
            const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

            return matchesSearch && matchesTopic && matchesDifficulty && matchesStatus;
        });
    };

    const getStats = () => {
        const total = problems.length;
        const planned = problems.filter(p => p.status === 'planned').length;
        const active = problems.filter(p => p.status === 'active').length;
        const mastered = problems.filter(p => p.status === 'mastered').length;

        return { total, planned, active, mastered };
    };

    const getTopics = () => {
        const topics = [...new Set(problems.map(p => p.topic))];
        return ['all', ...topics.sort()];
    };

    const stats = getStats();
    const filteredProblems = getFilteredProblems();
    const topics = getTopics();

    const statusColors = {
        planned: 'badge-primary',
        active: 'badge-warning',
        mastered: 'badge-success',
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold mb-2">DSA Tracker</h1>
                    <p className="text-gray-400">Striver's A2Z Sheet - {stats.total} Problems</p>
                </div>

                {/* Export Buttons */}
                <div className="flex gap-3">
                    {selectionMode ? (
                        <>
                            <button
                                onClick={() => exportToPDF(false)}
                                className="btn-primary"
                                disabled={selectedForExport.size === 0}
                            >
                                <Download size={18} />
                                Export Selected ({selectedForExport.size})
                            </button>
                            <button
                                onClick={toggleSelectionMode}
                                className="btn-secondary"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => exportToPDF(true)}
                                className="btn-secondary"
                            >
                                <Download size={18} />
                                Export All Notes
                            </button>
                            <button
                                onClick={toggleSelectionMode}
                                className="btn-primary"
                            >
                                <CheckSquare size={18} />
                                Select & Export
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="card text-center">
                    <p className="text-sm text-gray-400">Total</p>
                    <p className="text-3xl font-bold mt-1">{stats.total}</p>
                </div>
                <div className="card text-center bg-gradient-to-br from-accent-primary/20 to-accent-primary/5">
                    <p className="text-sm text-gray-400">Planned</p>
                    <p className="text-3xl font-bold mt-1">{stats.planned}</p>
                </div>
                <div className="card text-center bg-gradient-to-br from-accent-warning/20 to-accent-warning/5">
                    <p className="text-sm text-gray-400">Active</p>
                    <p className="text-3xl font-bold mt-1">{stats.active}</p>
                </div>
                <div className="card text-center bg-gradient-to-br from-accent-success/20 to-accent-success/5">
                    <p className="text-sm text-gray-400">Mastered</p>
                    <p className="text-3xl font-bold mt-1">{stats.mastered}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="card">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium mb-2">Search</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search problems..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input pl-10"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Topic</label>
                        <select
                            value={topicFilter}
                            onChange={(e) => setTopicFilter(e.target.value)}
                            className="input"
                        >
                            {topics.map(topic => (
                                <option key={topic} value={topic}>
                                    {topic === 'all' ? 'All Topics' : topic}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Difficulty</label>
                        <select
                            value={difficultyFilter}
                            onChange={(e) => setDifficultyFilter(e.target.value)}
                            className="input"
                        >
                            <option value="all">All Difficulties</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Status</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="input"
                        >
                            <option value="all">All Status</option>
                            <option value="planned">Planned</option>
                            <option value="active">Active</option>
                            <option value="mastered">Mastered</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Problems List */}
            <div className="space-y-2">
                {filteredProblems.length === 0 ? (
                    <div className="card text-center py-12">
                        <p className="text-gray-400">No problems found matching your filters</p>
                    </div>
                ) : (
                    filteredProblems.map(problem => (
                        <div key={problem.id} className="card-hover flex items-center gap-4">
                            {/* Selection Checkbox */}
                            {selectionMode && (
                                <input
                                    type="checkbox"
                                    checked={selectedForExport.has(problem.id)}
                                    onChange={() => toggleSelection(problem.id)}
                                    className="w-5 h-5 text-accent-primary bg-dark-card border-dark-border rounded cursor-pointer"
                                />
                            )}

                            <div className="flex-1">
                                <h3 className="font-semibold">{problem.name}</h3>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-xs text-gray-400">{problem.topic}</span>
                                    <span className={`badge ${problem.difficulty === 'easy' ? 'badge-success' :
                                        problem.difficulty === 'medium' ? 'badge-warning' :
                                            'badge-danger'
                                        }`}>
                                        {problem.difficulty}
                                    </span>
                                    <span className={`badge ${statusColors[problem.status]}`}>
                                        {problem.status}
                                    </span>
                                    {problem.notes && problem.notes.trim() !== '' && (
                                        <span className="text-xs text-accent-success flex items-center gap-1">
                                            <StickyNote size={12} />
                                            Has notes
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <select
                                    value={problem.status}
                                    onChange={(e) => updateStatus(problem.id, e.target.value)}
                                    className="input text-sm py-1"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <option value="planned">Planned</option>
                                    <option value="active">Active</option>
                                    <option value="mastered">Mastered</option>
                                </select>

                                <button
                                    onClick={() => openProblemModal(problem)}
                                    className="btn-secondary text-sm"
                                >
                                    <StickyNote size={16} />
                                    Notes
                                </button>

                                {problem.leetcodeLink && (
                                    <a
                                        href={problem.leetcodeLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-primary text-sm"
                                    >
                                        <ExternalLink size={16} />
                                    </a>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Notes Modal */}
            <Modal
                isOpen={!!selectedProblem}
                onClose={() => setSelectedProblem(null)}
                title={`Notes: ${selectedProblem?.name}`}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Your Notes</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="input min-h-[200px]"
                            placeholder="Add your solution approach, time complexity, edge cases, etc..."
                            rows={8}
                        />
                    </div>

                    <div className="flex gap-3">
                        <button onClick={saveNotes} className="btn-primary flex-1">
                            Save Notes
                        </button>
                        <button onClick={() => setSelectedProblem(null)} className="btn-secondary">
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default DSA;
