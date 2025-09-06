// SynergySphere Application JavaScript

class SynergySphere {
    constructor() {
        // Initialize data from provided JSON
        this.users = [
            {"id": 1, "name": "John Doe", "email": "john@example.com", "password": "password123", "avatar": "JD", "role": "Project Manager"},
            {"id": 2, "name": "Jane Smith", "email": "jane@example.com", "password": "password123", "avatar": "JS", "role": "Developer"},
            {"id": 3, "name": "Mike Johnson", "email": "mike@example.com", "password": "password123", "avatar": "MJ", "role": "Designer"}
        ];

        this.projects = [
            {"id": 1, "name": "Website Redesign", "description": "Complete overhaul of company website with modern design", "createdBy": 1, "members": [1, 2, 3], "createdDate": "2025-08-01", "status": "active"},
            {"id": 2, "name": "Mobile App Development", "description": "Native iOS and Android app for customer engagement", "createdBy": 1, "members": [1, 2], "createdDate": "2025-08-15", "status": "active"},
            {"id": 3, "name": "Marketing Campaign", "description": "Q4 digital marketing campaign launch", "createdBy": 2, "members": [2, 3], "createdDate": "2025-09-01", "status": "planning"}
        ];

        this.tasks = [
            {"id": 1, "projectId": 1, "title": "Create wireframes", "description": "Design initial wireframes for all main pages", "assigneeId": 3, "creatorId": 1, "dueDate": "2025-09-15", "priority": "high", "status": "In Progress", "createdDate": "2025-09-01"},
            {"id": 2, "projectId": 1, "title": "Setup development environment", "description": "Configure development tools and frameworks", "assigneeId": 2, "creatorId": 1, "dueDate": "2025-09-10", "priority": "medium", "status": "Done", "createdDate": "2025-09-01"},
            {"id": 3, "projectId": 1, "title": "Content audit", "description": "Review and catalog all existing website content", "assigneeId": 1, "creatorId": 1, "dueDate": "2025-09-20", "priority": "low", "status": "To-Do", "createdDate": "2025-09-02"},
            {"id": 4, "projectId": 2, "title": "API integration", "description": "Integrate backend APIs for user authentication", "assigneeId": 2, "creatorId": 1, "dueDate": "2025-09-25", "priority": "high", "status": "To-Do", "createdDate": "2025-09-05"},
            {"id": 5, "projectId": 2, "title": "UI mockups", "description": "Create detailed UI mockups for all app screens", "assigneeId": 3, "creatorId": 1, "dueDate": "2025-09-18", "priority": "medium", "status": "In Progress", "createdDate": "2025-09-03"}
        ];

        this.messages = [
            {"id": 1, "projectId": 1, "userId": 1, "content": "Let's get started with the wireframes. I'll share some reference sites.", "timestamp": "2025-09-06T09:00:00Z", "threadId": 1},
            {"id": 2, "projectId": 1, "userId": 3, "content": "Sounds good! I'm working on the initial sketches now.", "timestamp": "2025-09-06T09:15:00Z", "threadId": 1},
            {"id": 3, "projectId": 1, "userId": 2, "content": "Dev environment is ready. Let me know when wireframes are done.", "timestamp": "2025-09-06T10:30:00Z", "threadId": 1},
            {"id": 4, "projectId": 2, "userId": 1, "content": "Mobile app project kickoff! Let's discuss the main features we need to implement.", "timestamp": "2025-09-06T11:00:00Z", "threadId": 2},
            {"id": 5, "projectId": 2, "userId": 2, "content": "I've outlined the API structure. Will start with user auth endpoints.", "timestamp": "2025-09-06T11:20:00Z", "threadId": 2}
        ];

        this.notifications = [
            {"id": 1, "userId": 1, "type": "task_assigned", "content": "You have been assigned to 'Content audit' task", "read": false, "timestamp": "2025-09-06T09:00:00Z"},
            {"id": 2, "userId": 2, "type": "task_completed", "content": "Task 'Setup development environment' has been completed", "read": true, "timestamp": "2025-09-06T08:30:00Z"},
            {"id": 3, "userId": 3, "type": "project_update", "content": "New message in 'Website Redesign' project", "read": false, "timestamp": "2025-09-06T10:35:00Z"}
        ];

        this.currentUser = null;
        this.currentProject = null;
        this.nextId = {
            user: 4,
            project: 4,
            task: 6,
            message: 6,
            notification: 4
        };

        this.init();
    }

    init() {
        this.loadFromStorage();
        this.setupEventListeners();
        this.checkAuthentication();
    }

    loadFromStorage() {
        try {
            const stored = localStorage.getItem('synergyData');
            if (stored) {
                const data = JSON.parse(stored);
                this.users = data.users || this.users;
                this.projects = data.projects || this.projects;
                this.tasks = data.tasks || this.tasks;
                this.messages = data.messages || this.messages;
                this.notifications = data.notifications || this.notifications;
                this.nextId = data.nextId || this.nextId;
            }
            
            const currentUser = localStorage.getItem('currentUser');
            if (currentUser) {
                this.currentUser = JSON.parse(currentUser);
            }
        } catch (error) {
            console.error('Error loading from storage:', error);
        }
    }

    saveToStorage() {
        try {
            const data = {
                users: this.users,
                projects: this.projects,
                tasks: this.tasks,
                messages: this.messages,
                notifications: this.notifications,
                nextId: this.nextId
            };
            localStorage.setItem('synergyData', JSON.stringify(data));
            if (this.currentUser) {
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            }
        } catch (error) {
            console.error('Error saving to storage:', error);
        }
    }

    setupEventListeners() {
        // Authentication tabs
        const authTabs = document.querySelectorAll('.auth-tab');
        authTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleAuthTabSwitch(tab);
            });
        });

        // Forms
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Navigation
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.navigateToPage(page);
            });
        });

        // Mobile menu
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        const mobileOverlay = document.getElementById('mobile-overlay');
        if (mobileOverlay) {
            mobileOverlay.addEventListener('click', () => this.closeMobileMenu());
        }

        // Logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }

        // Project actions
        const createProjectBtn = document.getElementById('create-project-btn');
        if (createProjectBtn) {
            createProjectBtn.addEventListener('click', () => this.showCreateProjectModal());
        }

        const projectForm = document.getElementById('project-form');
        if (projectForm) {
            projectForm.addEventListener('submit', (e) => this.handleProjectSubmit(e));
        }

        // Task actions
        const taskForm = document.getElementById('task-form');
        if (taskForm) {
            taskForm.addEventListener('submit', (e) => this.handleTaskSubmit(e));
        }

        // Modal close handlers
        const modalCloses = document.querySelectorAll('.modal-close');
        modalCloses.forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = closeBtn.getAttribute('data-modal');
                this.closeModal(modalId);
            });
        });

        // Modal background clicks
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // Team and chat
        const manageTeamBtn = document.getElementById('manage-team-btn');
        if (manageTeamBtn) {
            manageTeamBtn.addEventListener('click', () => this.showTeamModal());
        }

        const projectChatBtn = document.getElementById('project-chat-btn');
        if (projectChatBtn) {
            projectChatBtn.addEventListener('click', () => this.showChatModal());
        }

        const addMemberBtn = document.getElementById('add-member-btn');
        if (addMemberBtn) {
            addMemberBtn.addEventListener('click', () => this.addTeamMember());
        }

        const sendMessageBtn = document.getElementById('send-message-btn');
        if (sendMessageBtn) {
            sendMessageBtn.addEventListener('click', () => this.sendMessage());
        }
        
        // Back navigation
        const backBtn = document.getElementById('back-to-projects');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.navigateToPage('projects'));
        }

        // Chat input
        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }

        // Notifications
        const notificationBell = document.getElementById('notification-bell');
        if (notificationBell) {
            notificationBell.addEventListener('click', () => this.showNotifications());
        }

        // Delegated event listeners for dynamic content
        document.addEventListener('click', (e) => {
            // Project cards
            if (e.target.closest('.project-card')) {
                const card = e.target.closest('.project-card');
                const projectId = parseInt(card.getAttribute('data-project-id'));
                this.openProject(projectId);
            }

            // Task cards
            if (e.target.closest('.task-card')) {
                const card = e.target.closest('.task-card');
                const taskId = parseInt(card.getAttribute('data-task-id'));
                this.showTaskDetail(taskId);
            }

            // Add task buttons
            if (e.target.matches('.add-task-btn') || e.target.closest('.add-task-btn')) {
                const btn = e.target.closest('.add-task-btn') || e.target;
                const status = btn.getAttribute('data-status');
                this.showCreateTaskModal(status);
            }

            // Remove member buttons
            if (e.target.matches('.remove-member-btn') || e.target.closest('.remove-member-btn')) {
                const btn = e.target.closest('.remove-member-btn') || e.target;
                const memberId = parseInt(btn.getAttribute('data-member-id'));
                this.removeMember(memberId);
            }
        });
    }

    checkAuthentication() {
        if (this.currentUser) {
            this.showMainApp();
            this.updateUserInfo();
            this.navigateToPage('dashboard');
        } else {
            this.showAuthScreen();
        }
    }

    handleAuthTabSwitch(tab) {
        const tabName = tab.getAttribute('data-tab');
        
        // Update tab active state
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Update form active state
        document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
        const targetForm = document.getElementById(`${tabName}-form`);
        if (targetForm) {
            targetForm.classList.add('active');
        }
    }

    handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value.trim();

        if (!email || !password) {
            this.showToast('Please enter both email and password', 'error');
            return;
        }

        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = user;
            this.saveToStorage();
            this.showToast('Login successful!', 'success');
            
            // Immediate redirect without delay
            this.showMainApp();
            this.updateUserInfo();
            this.navigateToPage('dashboard');
        } else {
            this.showToast('Invalid email or password', 'error');
        }
    }

    handleRegister(e) {
        e.preventDefault();
        const name = document.getElementById('register-name').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value.trim();
        const role = document.getElementById('register-role').value;

        if (!name || !email || !password) {
            this.showToast('Please fill in all required fields', 'error');
            return;
        }

        // Check if email already exists
        if (this.users.find(u => u.email === email)) {
            this.showToast('Email already registered', 'error');
            return;
        }

        // Create new user
        const newUser = {
            id: this.nextId.user++,
            name,
            email,
            password,
            avatar: name.split(' ').map(n => n[0]).join('').toUpperCase(),
            role
        };

        this.users.push(newUser);
        this.currentUser = newUser;
        this.saveToStorage();
        this.showToast('Registration successful!', 'success');
        
        // Immediate redirect without delay
        this.showMainApp();
        this.updateUserInfo();
        this.navigateToPage('dashboard');
    }

    logout() {
        this.currentUser = null;
        this.currentProject = null;
        localStorage.removeItem('currentUser');
        this.showAuthScreen();
        this.showToast('Logged out successfully', 'info');
    }

    showAuthScreen() {
        const authScreen = document.getElementById('auth-screen');
        const mainApp = document.getElementById('main-app');
        
        if (authScreen) {
            authScreen.classList.remove('hidden');
            authScreen.style.display = 'flex';
        }
        if (mainApp) {
            mainApp.classList.add('hidden');
            mainApp.style.display = 'none';
        }
    }

    showMainApp() {
        const authScreen = document.getElementById('auth-screen');
        const mainApp = document.getElementById('main-app');
        
        if (authScreen) {
            authScreen.classList.add('hidden');
            authScreen.style.display = 'none';
        }
        if (mainApp) {
            mainApp.classList.remove('hidden');
            mainApp.style.display = 'grid';
        }
    }

    updateUserInfo() {
        if (this.currentUser) {
            const userName = document.getElementById('user-name');
            const userAvatar = document.getElementById('user-avatar');
            
            if (userName) userName.textContent = this.currentUser.name;
            if (userAvatar) userAvatar.textContent = this.currentUser.avatar;
        }
    }

    navigateToPage(pageName) {
        // Update nav active state
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === pageName) {
                link.classList.add('active');
            }
        });

        // Update page active state
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        const targetPage = document.getElementById(`${pageName}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Load page-specific content
        switch (pageName) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'projects':
                this.loadProjects();
                break;
            case 'tasks':
                this.loadTasks();
                break;
        }

        this.closeMobileMenu();
    }

    loadDashboard() {
        this.updateDashboardStats();
        this.loadRecentProjects();
        this.loadRecentTasks();
        this.updateNotificationCount();
    }

    updateDashboardStats() {
        const userProjects = this.projects.filter(p => p.members.includes(this.currentUser.id));
        const userTasks = this.tasks.filter(t => 
            userProjects.some(p => p.id === t.projectId) || 
            t.assigneeId === this.currentUser.id ||
            t.creatorId === this.currentUser.id
        );
        const completedTasks = userTasks.filter(t => t.status === 'Done');
        const allMembers = new Set();
        userProjects.forEach(p => p.members.forEach(m => allMembers.add(m)));

        const totalProjectsEl = document.getElementById('total-projects');
        const totalTasksEl = document.getElementById('total-tasks');
        const completedTasksEl = document.getElementById('completed-tasks');
        const teamMembersEl = document.getElementById('team-members');

        if (totalProjectsEl) totalProjectsEl.textContent = userProjects.length;
        if (totalTasksEl) totalTasksEl.textContent = userTasks.length;
        if (completedTasksEl) completedTasksEl.textContent = completedTasks.length;
        if (teamMembersEl) teamMembersEl.textContent = allMembers.size;
    }

    loadRecentProjects() {
        const userProjects = this.projects
            .filter(p => p.members.includes(this.currentUser.id))
            .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
            .slice(0, 3);

        const container = document.getElementById('recent-projects');
        if (!container) return;

        container.innerHTML = '';

        if (userProjects.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No projects yet. Create your first project!</p></div>';
            return;
        }

        userProjects.forEach(project => {
            const projectCard = this.createProjectCard(project);
            container.appendChild(projectCard);
        });
    }

    loadRecentTasks() {
        const userProjects = this.projects.filter(p => p.members.includes(this.currentUser.id));
        const userTasks = this.tasks
            .filter(t => 
                userProjects.some(p => p.id === t.projectId) || 
                t.assigneeId === this.currentUser.id
            )
            .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
            .slice(0, 5);

        const container = document.getElementById('recent-tasks');
        if (!container) return;

        container.innerHTML = '';

        if (userTasks.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No recent tasks.</p></div>';
            return;
        }

        userTasks.forEach(task => {
            const taskItem = this.createTaskListItem(task);
            container.appendChild(taskItem);
        });
    }

    loadProjects() {
        const userProjects = this.projects.filter(p => p.members.includes(this.currentUser.id));
        const container = document.getElementById('projects-grid');
        if (!container) return;

        container.innerHTML = '';

        if (userProjects.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">
                        <i class="fas fa-folder-open"></i>
                    </div>
                    <h3>No projects yet</h3>
                    <p>Create your first project to get started with team collaboration.</p>
                </div>
            `;
            return;
        }

        userProjects.forEach(project => {
            const projectCard = this.createProjectCard(project);
            container.appendChild(projectCard);
        });
    }

    loadTasks() {
        // This method can be implemented if needed for a dedicated tasks page
    }

    createProjectCard(project) {
        const div = document.createElement('div');
        div.className = 'project-card';
        div.setAttribute('data-project-id', project.id);

        const members = project.members.map(id => this.users.find(u => u.id === id)).filter(Boolean);
        const projectTasks = this.tasks.filter(t => t.projectId === project.id);
        
        div.innerHTML = `
            <div class="project-card-header">
                <h3 class="project-title">${project.name}</h3>
                <span class="project-status ${project.status}">${project.status}</span>
            </div>
            <p class="project-description">${project.description}</p>
            <div class="project-meta">
                <div class="project-team">
                    <i class="fas fa-users"></i>
                    <span>${members.length} members</span>
                    <div class="team-avatars">
                        ${members.slice(0, 3).map(member => 
                            `<div class="team-avatar">${member.avatar}</div>`
                        ).join('')}
                        ${members.length > 3 ? `<div class="team-avatar">+${members.length - 3}</div>` : ''}
                    </div>
                </div>
                <div class="project-tasks">
                    <i class="fas fa-tasks"></i>
                    <span>${projectTasks.length} tasks</span>
                </div>
            </div>
        `;

        return div;
    }

    createTaskListItem(task) {
        const div = document.createElement('div');
        div.className = 'task-list-item';
        div.setAttribute('data-task-id', task.id);

        const assignee = this.users.find(u => u.id === task.assigneeId);
        const project = this.projects.find(p => p.id === task.projectId);
        
        div.innerHTML = `
            <div class="task-card-header">
                <h4 class="task-title">${task.title}</h4>
                <span class="task-priority ${task.priority}">${task.priority}</span>
            </div>
            <p class="task-description">${task.description}</p>
            <div class="task-meta">
                <div class="task-assignee">
                    ${assignee ? `
                        <div class="assignee-avatar">${assignee.avatar}</div>
                        <span>${assignee.name}</span>
                    ` : '<span>Unassigned</span>'}
                </div>
                <div class="task-info">
                    <span class="task-project">${project ? project.name : 'Unknown Project'}</span>
                    <span class="task-due-date">${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</span>
                </div>
            </div>
        `;

        return div;
    }

    openProject(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;

        this.currentProject = project;
        
        // Update project detail page
        const titleEl = document.getElementById('project-detail-title');
        const descEl = document.getElementById('project-detail-description');
        
        if (titleEl) titleEl.textContent = project.name;
        if (descEl) descEl.textContent = project.description;
        
        // Load kanban board
        this.loadKanbanBoard(projectId);
        
        // Navigate to project detail page
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        const projectDetailPage = document.getElementById('project-detail-page');
        if (projectDetailPage) {
            projectDetailPage.classList.add('active');
        }
    }

    loadKanbanBoard(projectId) {
        const projectTasks = this.tasks.filter(t => t.projectId === projectId);
        
        // Clear existing tasks
        const todoTasks = document.getElementById('todo-tasks');
        const progressTasks = document.getElementById('progress-tasks');
        const doneTasks = document.getElementById('done-tasks');
        
        if (todoTasks) todoTasks.innerHTML = '';
        if (progressTasks) progressTasks.innerHTML = '';
        if (doneTasks) doneTasks.innerHTML = '';
        
        // Update counts
        const todoCounts = projectTasks.filter(t => t.status === 'To-Do').length;
        const progressCounts = projectTasks.filter(t => t.status === 'In Progress').length;
        const doneCounts = projectTasks.filter(t => t.status === 'Done').length;
        
        const todoCountEl = document.getElementById('todo-count');
        const progressCountEl = document.getElementById('progress-count');
        const doneCountEl = document.getElementById('done-count');
        
        if (todoCountEl) todoCountEl.textContent = todoCounts;
        if (progressCountEl) progressCountEl.textContent = progressCounts;
        if (doneCountEl) doneCountEl.textContent = doneCounts;
        
        // Populate tasks
        projectTasks.forEach(task => {
            const taskCard = this.createTaskCard(task);
            const containerId = this.getTaskContainerId(task.status);
            const container = document.getElementById(containerId);
            if (container) {
                container.appendChild(taskCard);
            }
        });
    }

    createTaskCard(task) {
        const div = document.createElement('div');
        div.className = 'task-card';
        div.setAttribute('data-task-id', task.id);

        const assignee = this.users.find(u => u.id === task.assigneeId);
        
        div.innerHTML = `
            <div class="task-card-header">
                <h4 class="task-title">${task.title}</h4>
                <span class="task-priority ${task.priority}">${task.priority}</span>
            </div>
            <p class="task-description">${task.description}</p>
            <div class="task-meta">
                <div class="task-assignee">
                    ${assignee ? `
                        <div class="assignee-avatar">${assignee.avatar}</div>
                        <span>${assignee.name}</span>
                    ` : '<span>Unassigned</span>'}
                </div>
                <div class="task-due-date">${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</div>
            </div>
        `;

        return div;
    }

    getTaskContainerId(status) {
        switch (status) {
            case 'To-Do': return 'todo-tasks';
            case 'In Progress': return 'progress-tasks';
            case 'Done': return 'done-tasks';
            default: return 'todo-tasks';
        }
    }

    showCreateProjectModal() {
        const modalTitle = document.getElementById('project-modal-title');
        const projectForm = document.getElementById('project-form');
        
        if (modalTitle) modalTitle.textContent = 'Create Project';
        if (projectForm) projectForm.reset();
        
        this.showModal('project-modal');
    }

    handleProjectSubmit(e) {
        e.preventDefault();
        const nameEl = document.getElementById('project-name');
        const descEl = document.getElementById('project-description');
        
        if (!nameEl || !descEl) return;
        
        const name = nameEl.value.trim();
        const description = descEl.value.trim();

        if (!name) {
            this.showToast('Please enter a project name', 'error');
            return;
        }

        const newProject = {
            id: this.nextId.project++,
            name,
            description,
            createdBy: this.currentUser.id,
            members: [this.currentUser.id],
            createdDate: new Date().toISOString().split('T')[0],
            status: 'active'
        };

        this.projects.push(newProject);
        this.saveToStorage();
        this.closeModal('project-modal');
        this.loadProjects();
        this.showToast('Project created successfully!', 'success');
    }

    showCreateTaskModal(status = 'To-Do') {
        if (!this.currentProject) return;

        const modalTitle = document.getElementById('task-modal-title');
        const taskForm = document.getElementById('task-form');
        
        if (modalTitle) modalTitle.textContent = 'Create Task';
        if (taskForm) taskForm.reset();
        
        // Populate assignee dropdown
        const assigneeSelect = document.getElementById('task-assignee');
        if (assigneeSelect) {
            assigneeSelect.innerHTML = '<option value="">Select assignee...</option>';
            
            this.currentProject.members.forEach(memberId => {
                const member = this.users.find(u => u.id === memberId);
                if (member) {
                    const option = document.createElement('option');
                    option.value = member.id;
                    option.textContent = member.name;
                    assigneeSelect.appendChild(option);
                }
            });
        }
        
        this.showModal('task-modal');
    }

    handleTaskSubmit(e) {
        e.preventDefault();
        if (!this.currentProject) return;

        const titleEl = document.getElementById('task-title');
        const descEl = document.getElementById('task-description');
        const assigneeEl = document.getElementById('task-assignee');
        const priorityEl = document.getElementById('task-priority');
        const dueDateEl = document.getElementById('task-due-date');

        if (!titleEl || !descEl || !assigneeEl || !priorityEl || !dueDateEl) return;

        const title = titleEl.value.trim();
        const description = descEl.value.trim();
        const assigneeId = parseInt(assigneeEl.value) || null;
        const priority = priorityEl.value;
        const dueDate = dueDateEl.value;

        if (!title) {
            this.showToast('Please enter a task title', 'error');
            return;
        }

        const newTask = {
            id: this.nextId.task++,
            projectId: this.currentProject.id,
            title,
            description,
            assigneeId,
            creatorId: this.currentUser.id,
            dueDate: dueDate || null,
            priority,
            status: 'To-Do',
            createdDate: new Date().toISOString().split('T')[0]
        };

        this.tasks.push(newTask);
        
        // Create notification for assignee
        if (assigneeId && assigneeId !== this.currentUser.id) {
            const notification = {
                id: this.nextId.notification++,
                userId: assigneeId,
                type: 'task_assigned',
                content: `You have been assigned to '${title}' task`,
                read: false,
                timestamp: new Date().toISOString()
            };
            this.notifications.push(notification);
        }
        
        this.saveToStorage();
        this.closeModal('task-modal');
        this.loadKanbanBoard(this.currentProject.id);
        this.showToast('Task created successfully!', 'success');
    }

    showTaskDetail(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        const assignee = this.users.find(u => u.id === task.assigneeId);
        const creator = this.users.find(u => u.id === task.creatorId);
        const project = this.projects.find(p => p.id === task.projectId);

        const content = `
            <div class="task-detail">
                <h3>${task.title}</h3>
                <p><strong>Description:</strong> ${task.description || 'No description'}</p>
                <div class="task-detail-meta">
                    <p><strong>Project:</strong> ${project ? project.name : 'Unknown'}</p>
                    <p><strong>Assignee:</strong> ${assignee ? assignee.name : 'Unassigned'}</p>
                    <p><strong>Creator:</strong> ${creator ? creator.name : 'Unknown'}</p>
                    <p><strong>Priority:</strong> <span class="task-priority ${task.priority}">${task.priority}</span></p>
                    <p><strong>Status:</strong> ${task.status}</p>
                    <p><strong>Due Date:</strong> ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</p>
                    <p><strong>Created:</strong> ${new Date(task.createdDate).toLocaleDateString()}</p>
                </div>
            </div>
        `;

        const taskDetailContent = document.getElementById('task-detail-content');
        if (taskDetailContent) {
            taskDetailContent.innerHTML = content;
        }
        
        this.showModal('task-detail-modal');
    }

    showTeamModal() {
        if (!this.currentProject) return;

        this.loadTeamMembers();
        this.loadAvailableUsers();
        this.showModal('team-modal');
    }

    loadTeamMembers() {
        const container = document.getElementById('team-members-list');
        if (!container) return;

        container.innerHTML = '';

        this.currentProject.members.forEach(memberId => {
            const member = this.users.find(u => u.id === memberId);
            if (!member) return;

            const div = document.createElement('div');
            div.className = 'team-member-item';
            
            div.innerHTML = `
                <div class="member-info">
                    <div class="member-avatar">${member.avatar}</div>
                    <div class="member-details">
                        <h4>${member.name}</h4>
                        <p>${member.role}</p>
                    </div>
                </div>
                ${member.id !== this.currentProject.createdBy ? 
                    `<button class="remove-member-btn" data-member-id="${member.id}">
                        <i class="fas fa-times"></i>
                    </button>` : ''
                }
            `;

            container.appendChild(div);
        });
    }

    loadAvailableUsers() {
        const select = document.getElementById('add-member-select');
        if (!select) return;

        select.innerHTML = '<option value="">Select a user to add...</option>';

        const availableUsers = this.users.filter(u => 
            !this.currentProject.members.includes(u.id)
        );

        availableUsers.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = `${user.name} (${user.role})`;
            select.appendChild(option);
        });
    }

    addTeamMember() {
        const select = document.getElementById('add-member-select');
        if (!select) return;

        const userId = parseInt(select.value);
        
        if (!userId) {
            this.showToast('Please select a user to add', 'error');
            return;
        }

        this.currentProject.members.push(userId);
        this.saveToStorage();
        this.loadTeamMembers();
        this.loadAvailableUsers();
        this.showToast('Team member added successfully!', 'success');
    }

    removeMember(memberId) {
        this.currentProject.members = this.currentProject.members.filter(id => id !== memberId);
        this.saveToStorage();
        this.loadTeamMembers();
        this.loadAvailableUsers();
        this.showToast('Team member removed', 'info');
    }

    showChatModal() {
        if (!this.currentProject) return;

        this.loadChatMessages();
        this.showModal('chat-modal');
    }

    loadChatMessages() {
        const container = document.getElementById('chat-messages');
        if (!container) return;

        const projectMessages = this.messages
            .filter(m => m.projectId === this.currentProject.id)
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        container.innerHTML = '';

        if (projectMessages.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No messages yet. Start the conversation!</p></div>';
            return;
        }

        projectMessages.forEach(message => {
            const user = this.users.find(u => u.id === message.userId);
            const div = document.createElement('div');
            div.className = 'chat-message';
            
            div.innerHTML = `
                <div class="message-header">
                    <span class="message-sender">${user ? user.name : 'Unknown User'}</span>
                    <span class="message-time">${new Date(message.timestamp).toLocaleTimeString()}</span>
                </div>
                <p class="message-content">${message.content}</p>
            `;

            container.appendChild(div);
        });

        // Scroll to bottom
        container.scrollTop = container.scrollHeight;
    }

    sendMessage() {
        if (!this.currentProject) return;

        const input = document.getElementById('chat-input');
        if (!input) return;

        const content = input.value.trim();
        
        if (!content) return;

        const message = {
            id: this.nextId.message++,
            projectId: this.currentProject.id,
            userId: this.currentUser.id,
            content,
            timestamp: new Date().toISOString(),
            threadId: this.currentProject.id
        };

        this.messages.push(message);
        this.saveToStorage();
        input.value = '';
        this.loadChatMessages();
    }

    showNotifications() {
        const userNotifications = this.notifications
            .filter(n => n.userId === this.currentUser.id)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        if (userNotifications.length === 0) {
            this.showToast('No notifications', 'info');
            return;
        }

        // Mark as read
        userNotifications.forEach(n => n.read = true);
        this.saveToStorage();
        this.updateNotificationCount();

        // Show notifications (simplified - could be a modal)
        const latestNotifications = userNotifications.slice(0, 3);
        let notificationText = 'Latest notifications:';
        latestNotifications.forEach(n => {
            notificationText += `\nâ€¢ ${n.content}`;
        });
        
        this.showToast(notificationText, 'info');
    }

    updateNotificationCount() {
        const unreadCount = this.notifications.filter(n => 
            n.userId === this.currentUser.id && !n.read
        ).length;
        
        const counter = document.getElementById('notification-count');
        if (counter) {
            counter.textContent = unreadCount;
            counter.style.display = unreadCount > 0 ? 'block' : 'none';
        }
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    toggleMobileMenu() {
        const sidebar = document.getElementById('app-sidebar');
        const overlay = document.getElementById('mobile-overlay');
        
        if (sidebar) sidebar.classList.toggle('open');
        if (overlay) overlay.classList.toggle('show');
    }

    closeMobileMenu() {
        const sidebar = document.getElementById('app-sidebar');
        const overlay = document.getElementById('mobile-overlay');
        
        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('show');
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            info: 'fas fa-info-circle'
        };
        
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="toast-icon ${icons[type]}"></i>
            <span class="toast-message">${message}</span>
        `;
        
        container.appendChild(toast);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.parentElement.removeChild(toast);
            }
        }, 3000);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new SynergySphere();
});
