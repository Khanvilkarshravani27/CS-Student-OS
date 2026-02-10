import React from 'react';

const StatCard = ({ icon: Icon, label, value, color = 'primary', trend }) => {
    const colorClasses = {
        primary: 'from-accent-primary/20 to-accent-primary/5 border-accent-primary/30',
        secondary: 'from-accent-secondary/20 to-accent-secondary/5 border-accent-secondary/30',
        success: 'from-accent-success/20 to-accent-success/5 border-accent-success/30',
        warning: 'from-accent-warning/20 to-accent-warning/5 border-accent-warning/30',
        danger: 'from-accent-danger/20 to-accent-danger/5 border-accent-danger/30',
    };

    const iconColorClasses = {
        primary: 'text-accent-primary',
        secondary: 'text-accent-secondary',
        success: 'text-accent-success',
        warning: 'text-accent-warning',
        danger: 'text-accent-danger',
    };

    return (
        <div className={`card bg-gradient-to-br ${colorClasses[color]} animate-fade-in`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-gray-400 font-medium">{label}</p>
                    <p className="text-3xl font-bold mt-2">{value}</p>
                    {trend && (
                        <p className="text-xs text-gray-500 mt-2">{trend}</p>
                    )}
                </div>
                <div className={`p-3 rounded-lg bg-dark-surface/50 ${iconColorClasses[color]}`}>
                    <Icon size={24} />
                </div>
            </div>
        </div>
    );
};

export default StatCard;
