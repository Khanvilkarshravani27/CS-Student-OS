import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    CheckSquare,
    Code2,
    FolderGit2,
    Target,
    Zap,
    Briefcase,
    Users,
    FileText,
    BarChart3,
    Download,
    Trophy
} from 'lucide-react';
import { dataService } from '../services/storage';

const Sidebar = () => {
    const navItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
        { path: '/dsa', icon: Code2, label: 'DSA Tracker' },
        { path: '/projects', icon: FolderGit2, label: 'Projects' },
        { path: '/hackathons', icon: Trophy, label: 'Hackathons' },
        { path: '/habits', icon: Target, label: 'Habits' },
        { path: '/skills', icon: Zap, label: 'Skills' },
        { path: '/applications', icon: Briefcase, label: 'Applications' },
        { path: '/interview-prep', icon: Users, label: 'Interview Prep' },
        { path: '/weekly-review', icon: FileText, label: 'Weekly Review' },
        { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    ];

    const handleExport = () => {
        dataService.downloadBackup();
    };

    return (
        <div className="w-64 bg-dark-surface border-r border-dark-border flex flex-col">
            {/* Logo & Title */}
            <div className="p-6 border-b border-dark-border">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
                    CS Student OS
                </h1>
                <p className="text-sm text-gray-400 mt-1">Pro Edition</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                ? 'bg-accent-primary/20 text-accent-primary'
                                : 'text-gray-300 hover:bg-dark-hover hover:text-white'
                            }`
                        }
                    >
                        <item.icon size={20} />
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Export Button */}
            <div className="p-4 border-t border-dark-border">
                <button
                    onClick={handleExport}
                    className="w-full btn-secondary justify-center"
                >
                    <Download size={18} />
                    Export Data
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
