import React, { useState, useEffect } from 'react';
import { CheckSquare, Code2, FolderGit2, Flame, TrendingUp, Calendar, Sparkles, Edit2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import Modal from '../components/Modal';
import { taskService, dsaService, projectService, habitService, settingsService } from '../services/storage';

const motivationalQuotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Don't let yesterday take up too much of today.", author: "Will Rogers" },
    { text: "It's not whether you get knocked down, it's whether you get up.", author: "Vince Lombardi" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
    { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "The harder I work, the luckier I get.", author: "Gary Player" },
    { text: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller" },
    { text: "I find that the harder I work, the more luck I seem to have.", author: "Thomas Jefferson" },
    { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
    { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
    { text: "If you are working on something that you really care about, you don't have to be pushed.", author: "Steve Jobs" },
    { text: "People who are crazy enough to think they can change the world, are the ones who do.", author: "Rob Siltanen" },
    { text: "Failure is simply the opportunity to begin again, this time more intelligently.", author: "Henry Ford" },
    { text: "When something is important enough, you do it even if the odds are not in your favor.", author: "Elon Musk" },
    { text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas Edison" },
    { text: "A person who never made a mistake never tried anything new.", author: "Albert Einstein" },
    { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
    { text: "Success is walking from failure to failure with no loss of enthusiasm.", author: "Winston Churchill" },
    { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
    { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
    { text: "Do not wait to strike till the iron is hot, but make it hot by striking.", author: "William Butler Yeats" },
    { text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford" },
    { text: "The two most important days in your life are the day you are born and the day you find out why.", author: "Mark Twain" },
    { text: "Everything you can imagine is real.", author: "Pablo Picasso" },
];

const Dashboard = () => {
    const [stats, setStats] = useState({
        tasksToday: 0,
        dsaSolvedWeek: 0,
        activeProjects: 0,
        currentStreak: 0,
    });

    const [recentTasks, setRecentTasks] = useState([]);
    const [todayDate, setTodayDate] = useState('');
    const [dailyQuote, setDailyQuote] = useState(motivationalQuotes[0]);
    const [userName, setUserName] = useState('');
    const [showWelcomeModal, setShowWelcomeModal] = useState(false);
    const [nameInput, setNameInput] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        loadStats();
        loadRecentTasks();
        checkUserName();

        const now = new Date();
        setTodayDate(now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }));

        // Select daily quote based on day of year (same quote all day)
        const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        const quoteIndex = dayOfYear % motivationalQuotes.length;
        setDailyQuote(motivationalQuotes[quoteIndex]);

        // Update clock every second
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const checkUserName = () => {
        const savedName = settingsService.getUserName();
        if (savedName) {
            setUserName(savedName);
        } else {
            setShowWelcomeModal(true);
        }
    };

    const handleSaveName = () => {
        if (nameInput.trim()) {
            settingsService.setUserName(nameInput.trim());
            setUserName(nameInput.trim());
            setShowWelcomeModal(false);
            setNameInput('');
        }
    };

    const loadStats = () => {
        const tasks = taskService.getAll();
        const today = new Date().toISOString().split('T')[0];
        const tasksToday = tasks.filter(t =>
            !t.completed && t.deadline && t.deadline.startsWith(today)
        ).length;

        // DSA problems solved this week
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const dsaProblems = dsaService.getAll();
        const dsaSolvedWeek = dsaProblems.filter(p =>
            p.status === 'mastered'
        ).length; // Simplified - in real app, would check timestamp

        const projects = projectService.getAll();
        const activeProjects = projects.filter(p => p.status === 'active').length;

        // Get max streak from all habits
        const habits = habitService.getAll();
        const currentStreak = habits.reduce((max, habit) =>
            Math.max(max, habit.streak || 0), 0
        );

        setStats({
            tasksToday,
            dsaSolvedWeek,
            activeProjects,
            currentStreak,
        });
    };

    const loadRecentTasks = () => {
        const tasks = taskService.getAll();
        const incomplete = tasks.filter(t => !t.completed).slice(0, 5);
        setRecentTasks(incomplete);
    };

    const handleToggleTask = (id) => {
        taskService.toggle(id);
        loadStats();
        loadRecentTasks();
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header with Quote */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="flex items-center gap-3">
                        <h1 className="text-4xl font-bold mb-2">
                            Welcome back{userName ? `, ${userName}` : ''} !
                        </h1>
                        {userName && (
                            <button
                                onClick={() => {
                                    setNameInput(userName);
                                    setShowWelcomeModal(true);
                                }}
                                className="mb-2 p-2 hover:bg-dark-card rounded-lg transition-colors text-gray-400 hover:text-accent-primary"
                                title="Edit your name"
                            >
                                <Edit2 size={18} />
                            </button>
                        )}
                    </div>
                    <p className="text-gray-400">{todayDate}</p>




                    {/* Digital Clock - Enhanced Flip Card Style */}
                    <div className="mt-4 inline-flex items-center gap-3">
                        {/* Hours - Individual Digits */}
                        <div className="flex gap-2">
                            <div className="bg-gradient-to-b from-gray-100 to-white text-dark-bg font-bold text-5xl font-mono px-5 py-4 rounded-xl shadow-2xl min-w-[70px] text-center border border-gray-200">
                                {String(currentTime.getHours() % 12 || 12).padStart(2, '0').charAt(0)}
                            </div>
                            <div className="bg-gradient-to-b from-gray-100 to-white text-dark-bg font-bold text-5xl font-mono px-5 py-4 rounded-xl shadow-2xl min-w-[70px] text-center border border-gray-200">
                                {String(currentTime.getHours() % 12 || 12).padStart(2, '0').charAt(1)}
                            </div>
                        </div>

                        {/* Colon Separator */}
                        <div className="text-4xl font-bold text-gray-400 mb-2">:</div>

                        {/* Minutes - Individual Digits */}
                        <div className="flex gap-2">
                            <div className="bg-gradient-to-b from-gray-100 to-white text-dark-bg font-bold text-5xl font-mono px-5 py-4 rounded-xl shadow-2xl min-w-[70px] text-center border border-gray-200">
                                {String(currentTime.getMinutes()).padStart(2, '0').charAt(0)}
                            </div>
                            <div className="bg-gradient-to-b from-gray-100 to-white text-dark-bg font-bold text-5xl font-mono px-5 py-4 rounded-xl shadow-2xl min-w-[70px] text-center border border-gray-200">
                                {String(currentTime.getMinutes()).padStart(2, '0').charAt(1)}
                            </div>
                        </div>

                        {/* AM/PM */}
                        <div className="bg-gradient-to-b from-gray-100 to-white text-dark-bg font-bold text-lg px-4 py-2 rounded-xl shadow-xl border border-gray-200">
                            {currentTime.getHours() >= 12 ? 'PM' : 'AM'}
                        </div>
                    </div>
                </div>

                {/* Daily Motivation Block - Enhanced */}
                <div className="relative group">
                    {/* Animated background glow */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-warning rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition duration-1000 animate-pulse"></div>

                    {/* Main card */}
                    <div className="relative card bg-gradient-to-br from-accent-primary/30 via-accent-secondary/20 to-accent-warning/10 border-2 border-accent-primary/50 overflow-hidden">
                        {/* Floating orbs background */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-accent-primary/20 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent-secondary/20 rounded-full blur-3xl"></div>

                        {/* Content */}
                        <div className="relative z-10 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent-primary/20 backdrop-blur-sm">
                                    <Sparkles className="text-accent-primary animate-pulse" size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-accent-primary uppercase tracking-wide">Daily Fuel</h3>
                            </div>

                            {/* Quote text - larger and bolder */}
                            <p className="text-xl font-bold leading-relaxed mb-4 text-white">
                                "{dailyQuote.text}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center justify-end gap-2">
                                <div className="h-px w-8 bg-accent-primary/50"></div>
                                <p className="text-sm font-semibold text-accent-primary">
                                    {dailyQuote.author}
                                </p>
                            </div>
                        </div>

                        {/* Corner accent */}
                        <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-accent-warning/30 rounded-tr-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-accent-primary/30 rounded-bl-2xl"></div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={CheckSquare}
                    label="Tasks Today"
                    value={stats.tasksToday}
                    color="primary"
                />
                <StatCard
                    icon={Code2}
                    label="DSA Solved This Week"
                    value={stats.dsaSolvedWeek}
                    color="success"
                />
                <StatCard
                    icon={FolderGit2}
                    label="Active Projects"
                    value={stats.activeProjects}
                    color="secondary"
                />
                <StatCard
                    icon={Flame}
                    label="Current Streak"
                    value={`${stats.currentStreak} days`}
                    color="warning"
                />
            </div>

            {/* Quick Actions */}
            <div className="card">
                <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link to="/tasks" className="btn-primary justify-center">
                        <CheckSquare size={18} />
                        Add Task
                    </Link>
                    <Link to="/dsa" className="btn-primary justify-center">
                        <Code2 size={18} />
                        Solve Problem
                    </Link>
                    <Link to="/projects" className="btn-primary justify-center">
                        <FolderGit2 size={18} />
                        New Project
                    </Link>
                    <Link to="/habits" className="btn-primary justify-center">
                        <Flame size={18} />
                        Check Habits
                    </Link>
                </div>
            </div>

            {/* Today's Agenda */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                    <h2 className="text-2xl font-bold mb-4">Today's Tasks</h2>
                    {recentTasks.length === 0 ? (
                        <p className="text-gray-400 text-center py-8">No tasks for today. You're all caught up! 🎉</p>
                    ) : (
                        <div className="space-y-2">
                            {recentTasks.map(task => (
                                <div
                                    key={task.id}
                                    className="flex items-center gap-3 p-3 glass-hover rounded-lg"
                                    onClick={() => handleToggleTask(task.id)}
                                >
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => { }}
                                        className="w-5 h-5 rounded accent-accent-primary cursor-pointer"
                                    />
                                    <span className={task.completed ? 'line-through text-gray-500' : ''}>
                                        {task.title}
                                    </span>
                                    {task.priority && (
                                        <span className={`ml-auto badge badge-${task.priority === 'high' ? 'danger' :
                                            task.priority === 'medium' ? 'warning' :
                                                'primary'
                                            }`}>
                                            {task.priority}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    <Link to="/tasks" className="btn-secondary justify-center mt-4">
                        View All Tasks
                    </Link>
                </div>

                <div className="card">
                    <h2 className="text-2xl font-bold mb-4">This Week's Focus</h2>
                    <div className="space-y-4">
                        <div className="p-4 glass rounded-lg">
                            <div className="flex items-center gap-3 mb-2">
                                <TrendingUp className="text-accent-success" size={20} />
                                <h3 className="font-semibold">Goal Progress</h3>
                            </div>
                            <p className="text-sm text-gray-400">
                                Keep building momentum! Stay consistent with your habits and problem-solving.
                            </p>
                        </div>

                        <div className="p-4 glass rounded-lg">
                            <div className="flex items-center gap-3 mb-2">
                                <Calendar className="text-accent-primary" size={20} />
                                <h3 className="font-semibold">Weekly Target</h3>
                            </div>
                            <p className="text-sm text-gray-400">
                                Solve 10 DSA problems this week. Current: {stats.dsaSolvedWeek}/10
                            </p>
                            <div className="mt-2 w-full bg-dark-border rounded-full h-2">
                                <div
                                    className="bg-accent-primary h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${Math.min((stats.dsaSolvedWeek / 10) * 100, 100)}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Welcome Modal */}
            <Modal
                isOpen={showWelcomeModal}
                onClose={() => userName ? setShowWelcomeModal(false) : {}}
                title={userName ? "Edit Your Name ✏️" : "Welcome to CS Student OS! 🎉"}
            >
                <div className="space-y-6">
                    <div className="text-center">
                        <p className="text-lg text-gray-300 mb-4">
                            {userName ? "Update your display name" : "Let's personalize your experience!"}
                        </p>
                        <p className="text-sm text-gray-400">
                            {userName ? "Enter your new name below" : "What should we call you?"}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Your Name</label>
                        <input
                            type="text"
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSaveName()}
                            className="input-field"
                            placeholder="Enter your name..."
                            autoFocus
                        />
                    </div>

                    <button
                        onClick={handleSaveName}
                        className="btn-primary w-full"
                        disabled={!nameInput.trim()}
                    >
                        {userName ? 'Save Changes ✓' : 'Get Started 🚀'}
                    </button>
                    {userName && (
                        <button
                            onClick={() => {
                                setShowWelcomeModal(false);
                                setNameInput('');
                            }}
                            className="btn-secondary w-full"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default Dashboard;
