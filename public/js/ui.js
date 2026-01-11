

let currentState = {
    tasks: [],
    filters: {
        status: 'all',
        priority: 'all',
        search: '',
        sort: '-createdAt',
        page: 1,
        limit: 10
    },
    loading: false,
    selectedTask: null
};


export const updateState = (updates) => {
    currentState = { ...currentState, ...updates };
    console.log('🔄 State updated:', updates);
    
    // Trigger UI update if needed
    if (updates.tasks !== undefined) {
        renderTasks(currentState.tasks);
    }
};


export const getState = () => {
    return { ...currentState }; // Return copy
};


export const setLoading = (isLoading) => {
    const loadingElement = document.getElementById('loadingState');
    const tasksContainer = document.getElementById('tasksContainer');
    
    if (loadingElement) {
        loadingElement.style.display = isLoading ? 'block' : 'none';
    }
    
    if (tasksContainer) {
        tasksContainer.style.opacity = isLoading ? '0.5' : '1';
        tasksContainer.style.pointerEvents = isLoading ? 'none' : 'auto';
    }
    
    updateState({ loading: isLoading });
};

export const renderTasks = (tasks) => {
    const tasksContainer = document.getElementById('tasksContainer');
    const emptyState = document.getElementById('emptyState');
    
    if (!tasksContainer) {
        console.error('Tasks container not found');
        return;
    }
    
    const loadingState = document.getElementById('loadingState');
    if (loadingState) {
        loadingState.style.display = 'none';
    }
    
    if (!tasks || tasks.length === 0) {
        if (emptyState) {
            emptyState.classList.remove('hidden');
        }
        
        tasksContainer.innerHTML = '';
        updateTaskSummary(0);
        return;
    }
    
    if (emptyState) {
        emptyState.classList.add('hidden');
    }
    
    const tasksHTML = tasks.map(task => createTaskCard(task)).join('');
    
    tasksContainer.innerHTML = tasksHTML;
    
    updateTaskSummary(tasks.length);
    
    attachTaskEventListeners();
};


const createTaskCard = (task) => {
    let dueDateHTML = '';
    if (task.dueDate) {
        const dueDate = new Date(task.dueDate);
        const formattedDate = dueDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        
        const today = new Date();
        const isOverdue = dueDate < today && task.status !== 'completed';
        const overdueClass = isOverdue ? 'overdue' : '';
        
        dueDateHTML = `
            <div class="task-date ${overdueClass}">
                <span class="material-symbols-rounded date-icon">calendar_today</span>
                <span>Due: ${formattedDate}${isOverdue ? ' (Overdue)' : ''}</span>
            </div>
        `;
    }
    
    const createdDate = new Date(task.createdAt);
    const timeAgo = getTimeAgo(createdDate);
    
    const priorityClass = `tag-priority-${task.priority}`;
    
    const statusClass = `tag-status-${task.status}`;
    const statusText = task.status.replace('_', ' ');
    console.log(task._id)
    
    return `
        <div class="task-card" data-id="${task._id}">
            <div class="task-card-header">
                <div>
                    <h4 class="task-title">${escapeHTML(task.title)}</h4>
                    <div class="task-tags">
                        <span class="task-tag ${priorityClass}">${task.priority}</span>
                        <span class="task-tag ${statusClass}">${statusText}</span>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="btn btn-outline btn-sm btn-icon edit-task" data-id="${task._id}">
                        <span class="material-symbols-rounded">edit</span>
                    </button>
                    <button class="btn btn-outline btn-sm btn-icon delete-task" data-id="${task._id}">
                        <span class="material-symbols-rounded">delete</span>
                    </button>
                </div>
            </div>
            
            ${task.description ? `
                <p class="task-description">${escapeHTML(task.description)}</p>
            ` : ''}
            
            <div class="task-meta">
                ${dueDateHTML}
                <div class="text-xs text-gray-500">
                    Created: ${timeAgo}
                </div>
            </div>
        </div>
    `;
};


const attachTaskEventListeners = () => {
    document.querySelectorAll('.edit-task').forEach(button => {
        button.addEventListener('click', (e) => {
            const taskId = e.currentTarget.dataset.id;
            console.log(taskId)
            handleEditTask(taskId);
        });
    });
    
    document.querySelectorAll('.delete-task').forEach(button => {
        button.addEventListener('click', (e) => {
            const taskId = e.currentTarget.dataset.id;
            handleDeleteTask(taskId);
            console.log('delete Button working')
        });
    });
    
    document.querySelectorAll('.task-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.task-actions')) {
                const taskId = card.dataset.id;
                selectTask(taskId);
            }
        });
    });
};


const escapeHTML = (text) => {
    if (!text) return '';
    
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};


const getTimeAgo = (date) => {
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'just now';
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w ago`;
    
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
};


const updateTaskSummary = (count) => {
    const summaryElement = document.getElementById('tasksSummary');
    const titleElement = document.getElementById('tasksTitle');
    
    if (summaryElement) {
        const state = getState();
        const filterText = state.filters.status !== 'all' ? ` (${state.filters.status})` : '';
        summaryElement.textContent = `${count} tasks${filterText}`;
    }
    
    if (titleElement) {
        const state = getState();
        if (state.filters.status !== 'all') {
            titleElement.textContent = `${state.filters.status.replace('_', ' ')} Tasks`;
        } else {
            titleElement.textContent = 'My Tasks';
        }
    }
};


export const showMessage = (text, type = 'info') => {
    let messageElement = document.getElementById('globalMessage');
    
    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.id = 'globalMessage';
        messageElement.className = `global-message global-message-${type}`;
        document.body.appendChild(messageElement);
    }
    
    messageElement.textContent = text;
    messageElement.className = `global-message global-message-${type} show`;
    
    if (type === 'success') {
        setTimeout(() => {
            messageElement.classList.remove('show');
        }, 3000);
    }
};

let handleEditTask = (taskId) => {
    console.log('Edit task:', taskId);
};

let handleDeleteTask = (taskId) => {
    console.log('Delete task:', taskId);
};

let selectTask = (taskId) => {
    console.log('Select task:', taskId);
};


export const setEventHandlers = (handlers) => {
    if (handlers.edit) handleEditTask = handlers.edit;
    if (handlers.delete) handleDeleteTask = handlers.delete;
    if (handlers.select) selectTask = handlers.select;
};