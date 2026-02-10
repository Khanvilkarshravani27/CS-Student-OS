// Local Storage Service for CS Student OS
// Provides centralized data management for all features

const STORAGE_KEYS = {
    TASKS: 'cs_os_tasks',
    DSA_PROBLEMS: 'cs_os_dsa_problems',
    PROJECTS: 'cs_os_projects',
    HABITS: 'cs_os_habits',
    SKILLS: 'cs_os_skills',
    APPLICATIONS: 'cs_os_applications',
    INTERVIEWS: 'cs_os_interviews',
    WEEKLY_REVIEWS: 'cs_os_weekly_reviews',
    HACKATHONS: 'cs_os_hackathons',
    SETTINGS: 'cs_os_settings',
};

// Generic storage operations
const storage = {
    get: (key) => {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Error reading ${key} from localStorage:`, error);
            return null;
        }
    },

    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error writing ${key} to localStorage:`, error);
            return false;
        }
    },

    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Error removing ${key} from localStorage:`, error);
            return false;
        }
    },

    clear: () => {
        try {
            Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    },
};

// Initialize data if not exists
const initializeIfEmpty = (key, defaultValue) => {
    if (!storage.get(key)) {
        storage.set(key, defaultValue);
    }
};

// Tasks
export const taskService = {
    getAll: () => storage.get(STORAGE_KEYS.TASKS) || [],

    getById: (id) => {
        const tasks = taskService.getAll();
        return tasks.find(t => t.id === id);
    },

    create: (task) => {
        const tasks = taskService.getAll();
        const newTask = {
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            completed: false,
            ...task,
        };
        tasks.push(newTask);
        storage.set(STORAGE_KEYS.TASKS, tasks);
        return newTask;
    },

    update: (id, updates) => {
        const tasks = taskService.getAll();
        const index = tasks.findIndex(t => t.id === id);
        if (index !== -1) {
            tasks[index] = { ...tasks[index], ...updates };
            storage.set(STORAGE_KEYS.TASKS, tasks);
            return tasks[index];
        }
        return null;
    },

    delete: (id) => {
        const tasks = taskService.getAll();
        const filtered = tasks.filter(t => t.id !== id);
        storage.set(STORAGE_KEYS.TASKS, filtered);
        return true;
    },

    toggle: (id) => {
        const task = taskService.getById(id);
        if (task) {
            return taskService.update(id, { completed: !task.completed });
        }
        return null;
    },
};

// DSA Problems
export const dsaService = {
    getAll: () => storage.get(STORAGE_KEYS.DSA_PROBLEMS) || [],

    getById: (id) => {
        const problems = dsaService.getAll();
        return problems.find(p => p.id === id);
    },

    create: (problem) => {
        const problems = dsaService.getAll();
        const newProblem = {
            id: Date.now().toString(),
            status: 'planned',
            notes: '',
            ...problem,
        };
        problems.push(newProblem);
        storage.set(STORAGE_KEYS.DSA_PROBLEMS, problems);
        return newProblem;
    },

    update: (id, updates) => {
        const problems = dsaService.getAll();
        const index = problems.findIndex(p => p.id === id);
        if (index !== -1) {
            problems[index] = { ...problems[index], ...updates };
            storage.set(STORAGE_KEYS.DSA_PROBLEMS, problems);
            return problems[index];
        }
        return null;
    },

    delete: (id) => {
        const problems = dsaService.getAll();
        const filtered = problems.filter(p => p.id !== id);
        storage.set(STORAGE_KEYS.DSA_PROBLEMS, filtered);
        return true;
    },

    initializeWithStrivers: (striversData) => {
        const existing = dsaService.getAll();
        if (existing.length === 0) {
            storage.set(STORAGE_KEYS.DSA_PROBLEMS, striversData);
        }
    },
};

// Projects
export const projectService = {
    getAll: () => storage.get(STORAGE_KEYS.PROJECTS) || [],

    getById: (id) => {
        const projects = projectService.getAll();
        return projects.find(p => p.id === id);
    },

    create: (project) => {
        const projects = projectService.getAll();
        const newProject = {
            id: Date.now().toString(),
            status: 'planned',
            createdAt: new Date().toISOString(),
            ...project,
        };
        projects.push(newProject);
        storage.set(STORAGE_KEYS.PROJECTS, projects);
        return newProject;
    },

    update: (id, updates) => {
        const projects = projectService.getAll();
        const index = projects.findIndex(p => p.id === id);
        if (index !== -1) {
            projects[index] = { ...projects[index], ...updates };
            storage.set(STORAGE_KEYS.PROJECTS, projects);
            return projects[index];
        }
        return null;
    },

    delete: (id) => {
        const projects = projectService.getAll();
        const filtered = projects.filter(p => p.id !== id);
        storage.set(STORAGE_KEYS.PROJECTS, filtered);
        return true;
    },
};

// Habits
export const habitService = {
    getAll: () => storage.get(STORAGE_KEYS.HABITS) || [],

    getById: (id) => {
        const habits = habitService.getAll();
        return habits.find(h => h.id === id);
    },

    create: (habit) => {
        const habits = habitService.getAll();
        const newHabit = {
            id: Date.now().toString(),
            streak: 0,
            completions: {},
            createdAt: new Date().toISOString(),
            ...habit,
        };
        habits.push(newHabit);
        storage.set(STORAGE_KEYS.HABITS, habits);
        return newHabit;
    },

    update: (id, updates) => {
        const habits = habitService.getAll();
        const index = habits.findIndex(h => h.id === id);
        if (index !== -1) {
            habits[index] = { ...habits[index], ...updates };
            storage.set(STORAGE_KEYS.HABITS, habits);
            return habits[index];
        }
        return null;
    },

    delete: (id) => {
        const habits = habitService.getAll();
        const filtered = habits.filter(h => h.id !== id);
        storage.set(STORAGE_KEYS.HABITS, filtered);
        return true;
    },

    toggleToday: (id) => {
        const habit = habitService.getById(id);
        if (habit) {
            const today = new Date().toISOString().split('T')[0];
            const completions = { ...habit.completions };

            if (completions[today]) {
                delete completions[today];
            } else {
                completions[today] = true;
            }

            // Recalculate streak
            const streak = calculateStreak(completions);

            return habitService.update(id, { completions, streak });
        }
        return null;
    },
};

// Calculate habit streak
const calculateStreak = (completions) => {
    const dates = Object.keys(completions).sort().reverse();
    if (dates.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date();

    for (let i = 0; i < dates.length; i++) {
        const checkDate = new Date(currentDate);
        checkDate.setDate(checkDate.getDate() - i);
        const dateStr = checkDate.toISOString().split('T')[0];

        if (completions[dateStr]) {
            streak++;
        } else {
            break;
        }
    }

    return streak;
};

// Skills
export const skillService = {
    getAll: () => storage.get(STORAGE_KEYS.SKILLS) || [],

    getById: (id) => {
        const skills = skillService.getAll();
        return skills.find(s => s.id === id);
    },

    create: (skill) => {
        const skills = skillService.getAll();
        const newSkill = {
            id: Date.now().toString(),
            progress: 0,
            stage: 'beginner',
            resources: [],
            ...skill,
        };
        skills.push(newSkill);
        storage.set(STORAGE_KEYS.SKILLS, skills);
        return newSkill;
    },

    update: (id, updates) => {
        const skills = skillService.getAll();
        const index = skills.findIndex(s => s.id === id);
        if (index !== -1) {
            skills[index] = { ...skills[index], ...updates };
            storage.set(STORAGE_KEYS.SKILLS, skills);
            return skills[index];
        }
        return null;
    },

    delete: (id) => {
        const skills = skillService.getAll();
        const filtered = skills.filter(s => s.id !== id);
        storage.set(STORAGE_KEYS.SKILLS, filtered);
        return true;
    },
};

// Applications
export const applicationService = {
    getAll: () => storage.get(STORAGE_KEYS.APPLICATIONS) || [],

    getById: (id) => {
        const applications = applicationService.getAll();
        return applications.find(a => a.id === id);
    },

    create: (application) => {
        const applications = applicationService.getAll();
        const newApplication = {
            id: Date.now().toString(),
            status: 'applied',
            appliedAt: new Date().toISOString(),
            ...application,
        };
        applications.push(newApplication);
        storage.set(STORAGE_KEYS.APPLICATIONS, applications);
        return newApplication;
    },

    update: (id, updates) => {
        const applications = applicationService.getAll();
        const index = applications.findIndex(a => a.id === id);
        if (index !== -1) {
            applications[index] = { ...applications[index], ...updates };
            storage.set(STORAGE_KEYS.APPLICATIONS, applications);
            return applications[index];
        }
        return null;
    },

    delete: (id) => {
        const applications = applicationService.getAll();
        const filtered = applications.filter(a => a.id !== id);
        storage.set(STORAGE_KEYS.APPLICATIONS, filtered);
        return true;
    },
};

// Interviews
export const interviewService = {
    getAll: () => storage.get(STORAGE_KEYS.INTERVIEWS) || [],

    getById: (id) => {
        const interviews = interviewService.getAll();
        return interviews.find(i => i.id === id);
    },

    create: (interview) => {
        const interviews = interviewService.getAll();
        const newInterview = {
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            ...interview,
        };
        interviews.push(newInterview);
        storage.set(STORAGE_KEYS.INTERVIEWS, interviews);
        return newInterview;
    },

    update: (id, updates) => {
        const interviews = interviewService.getAll();
        const index = interviews.findIndex(i => i.id === id);
        if (index !== -1) {
            interviews[index] = { ...interviews[index], ...updates };
            storage.set(STORAGE_KEYS.INTERVIEWS, interviews);
            return interviews[index];
        }
        return null;
    },

    delete: (id) => {
        const interviews = interviewService.getAll();
        const filtered = interviews.filter(i => i.id !== id);
        storage.set(STORAGE_KEYS.INTERVIEWS, filtered);
        return true;
    },
};

// Weekly Reviews
export const weeklyReviewService = {
    getAll: () => storage.get(STORAGE_KEYS.WEEKLY_REVIEWS) || [],

    getById: (id) => {
        const reviews = weeklyReviewService.getAll();
        return reviews.find(r => r.id === id);
    },

    create: (review) => {
        const reviews = weeklyReviewService.getAll();
        const newReview = {
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            ...review,
        };
        reviews.push(newReview);
        storage.set(STORAGE_KEYS.WEEKLY_REVIEWS, reviews);
        return newReview;
    },

    update: (id, updates) => {
        const reviews = weeklyReviewService.getAll();
        const index = reviews.findIndex(r => r.id === id);
        if (index !== -1) {
            reviews[index] = { ...reviews[index], ...updates };
            storage.set(STORAGE_KEYS.WEEKLY_REVIEWS, reviews);
            return reviews[index];
        }
        return null;
    },

    delete: (id) => {
        const reviews = weeklyReviewService.getAll();
        const filtered = reviews.filter(r => r.id !== id);
        storage.set(STORAGE_KEYS.WEEKLY_REVIEWS, reviews);
        return true;
    },
};

// Hackathons
export const hackathonService = {
    getAll: () => storage.get(STORAGE_KEYS.HACKATHONS) || [],

    getById: (id) => {
        const hackathons = hackathonService.getAll();
        return hackathons.find(h => h.id === id);
    },

    create: (hackathon) => {
        const hackathons = hackathonService.getAll();
        const newHackathon = {
            id: Date.now().toString(),
            status: 'upcoming',
            createdAt: new Date().toISOString(),
            ...hackathon,
        };
        hackathons.push(newHackathon);
        storage.set(STORAGE_KEYS.HACKATHONS, hackathons);
        return newHackathon;
    },

    update: (id, updates) => {
        const hackathons = hackathonService.getAll();
        const index = hackathons.findIndex(h => h.id === id);
        if (index !== -1) {
            hackathons[index] = { ...hackathons[index], ...updates };
            storage.set(STORAGE_KEYS.HACKATHONS, hackathons);
            return hackathons[index];
        }
        return null;
    },

    delete: (id) => {
        const hackathons = hackathonService.getAll();
        const filtered = hackathons.filter(h => h.id !== id);
        storage.set(STORAGE_KEYS.HACKATHONS, filtered);
        return true;
    },
};

// Export/Import functionality
export const dataService = {
    exportAll: () => {
        const data = {
            tasks: taskService.getAll(),
            dsaProblems: dsaService.getAll(),
            projects: projectService.getAll(),
            habits: habitService.getAll(),
            skills: skillService.getAll(),
            applications: applicationService.getAll(),
            interviews: interviewService.getAll(),
            weeklyReviews: weeklyReviewService.getAll(),
            hackathons: hackathonService.getAll(),
            exportedAt: new Date().toISOString(),
        };
        return JSON.stringify(data, null, 2);
    },

    importAll: (jsonData) => {
        try {
            const data = JSON.parse(jsonData);

            if (data.tasks) storage.set(STORAGE_KEYS.TASKS, data.tasks);
            if (data.dsaProblems) storage.set(STORAGE_KEYS.DSA_PROBLEMS, data.dsaProblems);
            if (data.projects) storage.set(STORAGE_KEYS.PROJECTS, data.projects);
            if (data.habits) storage.set(STORAGE_KEYS.HABITS, data.habits);
            if (data.skills) storage.set(STORAGE_KEYS.SKILLS, data.skills);
            if (data.applications) storage.set(STORAGE_KEYS.APPLICATIONS, data.applications);
            if (data.interviews) storage.set(STORAGE_KEYS.INTERVIEWS, data.interviews);
            if (data.weeklyReviews) storage.set(STORAGE_KEYS.WEEKLY_REVIEWS, data.weeklyReviews);
            if (data.hackathons) storage.set(STORAGE_KEYS.HACKATHONS, data.hackathons);

            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    },

    downloadBackup: () => {
        const data = dataService.exportAll();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cs-os-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },
};

// Settings Service
export const settingsService = {
    get: () => storage.get(STORAGE_KEYS.SETTINGS) || {},

    getUserName: () => {
        const settings = storage.get(STORAGE_KEYS.SETTINGS) || {};
        return settings.userName || null;
    },

    setUserName: (userName) => {
        const settings = storage.get(STORAGE_KEYS.SETTINGS) || {};
        settings.userName = userName;
        storage.set(STORAGE_KEYS.SETTINGS, settings);
        return settings;
    },

    update: (updates) => {
        const settings = storage.get(STORAGE_KEYS.SETTINGS) || {};
        const updated = { ...settings, ...updates };
        storage.set(STORAGE_KEYS.SETTINGS, updated);
        return updated;
    },
};
