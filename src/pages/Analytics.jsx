import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { taskService, dsaService, projectService, habitService, applicationService } from '../services/storage';

const Analytics = () => {
    const [stats, setStats] = useState({
        tasks: { total: 0, completed: 0, pending: 0 },
        dsa: { total: 0, planned: 0, active: 0, mastered: 0, byTopic: [] },
        projects: { total: 0, planned: 0, active: 0, completed: 0 },
        habits: { total: 0, avgStreak: 0 },
        applications: { total: 0, byStatus: [] },
    });

    useEffect(() => {
        calculateStats();
    }, []);

    const calculateStats = () => {
        // Tasks
        const tasks = taskService.getAll();
        const tasksStats = {
            total: tasks.length,
            completed: tasks.filter(t => t.completed).length,
            pending: tasks.filter(t => !t.completed).length,
        };

        // DSA
        const dsaProblems = dsaService.getAll();
        const dsaByStatus = {
            planned: dsaProblems.filter(p => p.status === 'planned').length,
            active: dsaProblems.filter(p => p.status === 'active').length,
            mastered: dsaProblems.filter(p => p.status === 'mastered').length,
        };

        // DSA by topic
        const topics = {};
        dsaProblems.forEach(p => {
            if (!topics[p.topic]) topics[p.topic] = { total: 0, mastered: 0 };
            topics[p.topic].total++;
            if (p.status === 'mastered') topics[p.topic].mastered++;
        });

        const dsaByTopic = Object.entries(topics)
            .map(([topic, data]) => ({
                topic,
                total: data.total,
                mastered: data.mastered,
            }))
            .sort((a, b) => b.mastered - a.mastered)
            .slice(0, 8); // Top 8 topics

        // Projects
        const projects = projectService.getAll();
        const projectsStats = {
            total: projects.length,
            planned: projects.filter(p => p.status === 'planned').length,
            active: projects.filter(p => p.status === 'active').length,
            completed: projects.filter(p => p.status === 'completed').length,
        };

        // Habits
        const habits = habitService.getAll();
        const avgStreak = habits.length > 0
            ? Math.round(habits.reduce((sum, h) => sum + (h.streak || 0), 0) / habits.length)
            : 0;

        // Applications
        const applications = applicationService.getAll();
        const appByStatus = [
            { name: 'Applied', value: applications.filter(a => a.status === 'applied').length },
            { name: 'OA', value: applications.filter(a => a.status === 'oa').length },
            { name: 'Interview', value: applications.filter(a => a.status === 'interview').length },
            { name: 'Offer', value: applications.filter(a => a.status === 'offer').length },
            { name: 'Rejected', value: applications.filter(a => a.status === 'rejected').length },
        ].filter(item => item.value > 0);

        setStats({
            tasks: tasksStats,
            dsa: { ...dsaByStatus, total: dsaProblems.length, byTopic: dsaByTopic },
            projects: projectsStats,
            habits: { total: habits.length, avgStreak },
            applications: { total: applications.length, byStatus: appByStatus },
        });
    };

    const COLORS = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

    return (
        <div className="space-y-6 animate-fade-in">
            <h1 className="text-4xl font-bold">Analytics</h1>

            {/* Overall Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="card text-center">
                    <p className="text-sm text-gray-400">Total Tasks</p>
                    <p className="text-3xl font-bold mt-1">{stats.tasks.total}</p>
                    <p className="text-xs text-accent-success mt-1">{stats.tasks.completed} completed</p>
                </div>
                <div className="card text-center">
                    <p className="text-sm text-gray-400">DSA Problems</p>
                    <p className="text-3xl font-bold mt-1">{stats.dsa.total}</p>
                    <p className="text-xs text-accent-success mt-1">{stats.dsa.mastered} mastered</p>
                </div>
                <div className="card text-center">
                    <p className="text-sm text-gray-400">Projects</p>
                    <p className="text-3xl font-bold mt-1">{stats.projects.total}</p>
                    <p className="text-xs text-accent-warning mt-1">{stats.projects.active} active</p>
                </div>
                <div className="card text-center">
                    <p className="text-sm text-gray-400">Habits</p>
                    <p className="text-3xl font-bold mt-1">{stats.habits.total}</p>
                    <p className="text-xs text-accent-warning mt-1">{stats.habits.avgStreak} avg streak</p>
                </div>
                <div className="card text-center">
                    <p className="text-sm text-gray-400">Applications</p>
                    <p className="text-3xl font-bold mt-1">{stats.applications.total}</p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* DSA Progress by Topic */}
                <div className="card">
                    <h2 className="text-xl font-bold mb-4">DSA Progress by Topic</h2>
                    {stats.dsa.byTopic.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={stats.dsa.byTopic}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f28" />
                                <XAxis dataKey="topic" stroke="#9ca3af" angle={-45} textAnchor="end" height={100} />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#13131a', border: '1px solid #1f1f28' }}
                                    labelStyle={{ color: '#fff' }}
                                />
                                <Legend />
                                <Bar dataKey="mastered" fill="#10b981" name="Mastered" />
                                <Bar dataKey="total" fill="#6366f1" name="Total" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-gray-400 text-center py-12">No DSA data yet</p>
                    )}
                </div>

                {/* Application Pipeline */}
                <div className="card">
                    <h2 className="text-xl font-bold mb-4">Application Pipeline</h2>
                    {stats.applications.byStatus.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={stats.applications.byStatus}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {stats.applications.byStatus.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#13131a', border: '1px solid #1f1f28' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-gray-400 text-center py-12">No application data yet</p>
                    )}
                </div>

                {/* Task Completion */}
                <div className="card">
                    <h2 className="text-xl font-bold mb-4">Task Status</h2>
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-400">Completed</span>
                                <span className="text-sm font-semibold">{stats.tasks.completed}/{stats.tasks.total}</span>
                            </div>
                            <div className="w-full bg-dark-border rounded-full h-3">
                                <div
                                    className="bg-accent-success h-3 rounded-full transition-all duration-500"
                                    style={{
                                        width: `${stats.tasks.total > 0 ? (stats.tasks.completed / stats.tasks.total) * 100 : 0}%`,
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-400">Pending</span>
                                <span className="text-sm font-semibold">{stats.tasks.pending}/{stats.tasks.total}</span>
                            </div>
                            <div className="w-full bg-dark-border rounded-full h-3">
                                <div
                                    className="bg-accent-warning h-3 rounded-full transition-all duration-500"
                                    style={{
                                        width: `${stats.tasks.total > 0 ? (stats.tasks.pending / stats.tasks.total) * 100 : 0}%`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Project Status */}
                <div className="card">
                    <h2 className="text-xl font-bold mb-4">Project Status</h2>
                    <div className="space-y-4">
                        {[
                            { label: 'Completed', count: stats.projects.completed, color: 'accent-success' },
                            { label: 'Active', count: stats.projects.active, color: 'accent-warning' },
                            { label: 'Planned', count: stats.projects.planned, color: 'accent-primary' },
                        ].map(({ label, count, color }) => (
                            <div key={label}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-400">{label}</span>
                                    <span className="text-sm font-semibold">{count}/{stats.projects.total}</span>
                                </div>
                                <div className="w-full bg-dark-border rounded-full h-3">
                                    <div
                                        className={`bg-${color} h-3 rounded-full transition-all duration-500`}
                                        style={{
                                            width: `${stats.projects.total > 0 ? (count / stats.projects.total) * 100 : 0}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
