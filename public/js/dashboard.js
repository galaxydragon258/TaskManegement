
import { requireAuth, logout } from './auth.js';
import { getTask, createTask, updateTask, deleteTask, getStatisctics, validateTask } from './task.js';
import { updateState, getState, setLoading, renderTasks, showMessage, setEventHandlers } from './ui.js';


const initializeDashboard = async () => {
    console.log('🚀 Initializing dashboard...');
    
    try {
        if (!requireAuth()) {
            return; // User will be redirected to login
        }
        
      
            setupEventListeners();
        
        // 4. Load initial data
        await loadInitialData();
        
        // 5. Setup task event handlers
        setupTaskHandlers();
        
        console.log('✅ Dashboard initialized successfully');
        
    } catch (error) {
        console.error('❌ Dashboard initialization failed:', error);
        showMessage('Failed to load dashboard. Please refresh.', 'error');
    }
};

/**
 * 2. LOAD INITIAL DATA - Fetch tasks and stats
 */
const loadInitialData = async () => {
    console.log('📥 Loading initial data...');
    
    try {
        // Show loading state
        setLoading(true);
        
        // Load tasks and stats in parallel
        const [tasksResponse, statsResponse] = await Promise.allSettled([
            getTask(getState().filters),
            getStatisctics()
        ]);
        
        // Handle tasks response
        if (tasksResponse.status === 'fulfilled') {
            const tasksData = tasksResponse.value;
            updateState({
                tasks: tasksData.data || [],
                totalTasks: tasksData.count || 0
            });
            updateTaskSummary(tasksData);
        } else {
            console.error('Failed to load tasks:', tasksResponse.reason);
            showMessage('Failed to load tasks', 'error');
        }
        
        // Handle stats response
        if (statsResponse.status === 'fulfilled') {
            updateStatistics(statsResponse.value.data);
        } else {
            console.error('Failed to load stats:', statsResponse.reason);
            // Don't show error for stats - it's less critical
        }
        
    } catch (error) {
        console.error('Error loading initial data:', error);
        showMessage('Failed to load data', 'error');
    } finally {
        // Hide loading state
        setLoading(false);
    }
};

// ===== EVENT LISTENERS =====

/**
 * 3. SETUP EVENT LISTENERS - Attach all UI event handlers
 */
const setupEventListeners = () => {
    console.log('🔌 Setting up event listeners...');
    
    // ===== NAVIGATION =====
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // ===== TASK ACTIONS =====
    const createTaskBtn = document.getElementById('createTaskBtn');
    if (createTaskBtn) {
        createTaskBtn.addEventListener('click', () => openTaskModal());
    }
    
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshTasks);
    }
    
    const createFirstTaskBtn = document.getElementById('createFirstTaskBtn');
    if (createFirstTaskBtn) {
        createFirstTaskBtn.addEventListener('click', () => openTaskModal());
    }
    
    // ===== FILTERS =====
    // Status filters
    document.querySelectorAll('[data-filter]').forEach(button => {
        button.addEventListener('click', (e) => {
            const filter = e.currentTarget.dataset.filter;
            applyStatusFilter(filter);
            
            // Update active state
            document.querySelectorAll('[data-filter]').forEach(btn => {
                btn.classList.remove('active');
            });
            e.currentTarget.classList.add('active');
        });
    });
    
    // Priority filters
    document.querySelectorAll('[data-priority]').forEach(button => {
        button.addEventListener('click', (e) => {
            const priority = e.currentTarget.dataset.priority;
            applyPriorityFilter(priority);
            
            // Update active state
            document.querySelectorAll('[data-priority]').forEach(btn => {
                btn.classList.remove('active');
            });
            e.currentTarget.classList.add('active');
        });
    });
    
    // ===== SEARCH =====
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchInput) {
        // Search on button click
        if (searchBtn) {
            searchBtn.addEventListener('click', applySearch);
        }
        
        // Search on Enter key
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                applySearch();
            }
        });
        
        // Clear search on Escape
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchInput.value = '';
                applySearch();
            }
        });
    }
    
    // ===== SORTING =====
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', applySorting);
    }
    
    // ===== MODAL =====
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const taskForm = document.getElementById('taskForm');
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeTaskModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeTaskModal);
    }
    
    if (taskForm) {
        taskForm.addEventListener('submit', handleTaskSubmit);
    }
    
    // Close modal when clicking outside
    const modalOverlay = document.getElementById('taskModal');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeTaskModal();
            }
        });
    }
    
    // ===== PAGINATION =====
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    
    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', goToPreviousPage);
    }
    
    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', goToNextPage);
    }
    
    console.log('✅ Event listeners setup complete');
};

/**
 * 4. SETUP TASK HANDLERS - Provide handlers to UI module
 */
const setupTaskHandlers = () => {
    setEventHandlers({
        edit: handleEditTask,
        delete: handleDeleteTask,
        select: handleSelectTask
    });
};

const handleEditTask = async (taskId) => {
    console.log('📝 Editing task:', taskId);
    
    try {
        setLoading(true);
        
        // Fetch task details
        const response = await getTask(taskId);
        const task = response.data;
        
        // Open modal with task data
        openTaskModal(task,taskId);
        
    } catch (error) {
        console.error('Failed to load task for editing:', error);
        showMessage('Failed to load task', 'error');
    } finally {
        setLoading(false);
    }
};

/**
 * 6. HANDLE DELETE TASK - Delete with confirmation
 */
const handleDeleteTask = async (taskId) => {
    console.log('🗑️ Deleting task:', taskId);
    
    // Confirm deletion
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }
    
    try {
        setLoading(true);
        
        // Delete task
        await deleteTask(taskId);
        
        // Show success message
        showMessage('Task deleted successfully', 'success');
        
        // Refresh tasks
        await refreshTasks();
        
    } catch (error) {
        console.error('Failed to delete task:', error);
        showMessage('Failed to delete task: ' + error.message, 'error');
    } finally {
        setLoading(false);
    }
};

/**
 * 7. HANDLE SELECT TASK - Select task card
 */
const handleSelectTask = (taskId) => {
    console.log('👉 Selecting task:', taskId);
    
    // Remove selection from all tasks
    document.querySelectorAll('.task-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selection to clicked task
    const selectedCard = document.querySelector(`.task-card[data-id="${taskId}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    // Update state
    updateState({ selectedTask: taskId });
};

// ===== FILTERS & SEARCH =====

/**
 * 8. APPLY STATUS FILTER - Filter tasks by status
 */
const applyStatusFilter = async (status) => {
    console.log('🔍 Applying status filter:', status);
    
    const state = getState();
    const newFilters = { ...state.filters, status: status === 'all' ? '' : status, page: 1 };
    
    updateState({ filters: newFilters });
    await applyFilters(newFilters);
};

/**
 * 9. APPLY PRIORITY FILTER - Filter tasks by priority
 */
const applyPriorityFilter = async (priority) => {
    console.log('🔍 Applying priority filter:', priority);
    
    const state = getState();
    const newFilters = { ...state.filters, priority: priority === 'all' ? '' : priority, page: 1 };
    
    updateState({ filters: newFilters });
    await applyFilters(newFilters);
};

/**
 * 10. APPLY SEARCH - Search tasks
 */
const applySearch = async () => {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput ? searchInput.value.trim() : '';
    
    console.log('🔍 Applying search:', searchTerm);
    
    const state = getState();
    const newFilters = { ...state.filters, search: searchTerm, page: 1 };
    
    updateState({ filters: newFilters });
    await applyFilters(newFilters);
};

/**
 * 11. APPLY SORTING - Sort tasks
 */
const applySorting = async () => {
    const sortSelect = document.getElementById('sortSelect');
    const sortValue = sortSelect ? sortSelect.value : '-createdAt';
    
    console.log('🔍 Applying sorting:', sortValue);
    
    const state = getState();
    const newFilters = { ...state.filters, sort: sortValue, page: 1 };
    
    updateState({ filters: newFilters });
    await applyFilters(newFilters);
};

/**
 * 12. APPLY FILTERS - Generic filter application
 */
const applyFilters = async (filters) => {
    try {
        setLoading(true);
        
        // Fetch tasks with filters
        const response = await getTask(filters);
        
        // Update state
        updateState({
            tasks: response.data || [],
            filters: filters,
            totalTasks: response.total || 0
        });
        
        // Update pagination
        updatePagination(response.pagination);
        
        // Update summary
        updateTaskSummary(response);
        
    } catch (error) {
        console.error('Failed to apply filters:', error);
        showMessage('Failed to load tasks', 'error');
    } finally {
        setLoading(false);
    }
};

// ===== MODAL OPERATIONS =====

/**
 * 13. OPEN TASK MODAL - Open modal for create/edit
 */
const openTaskModal = (task = null,taskId) => {
    console.log('📋 Opening task modal:', task ? 'edit' : 'create');
    
    const modal = document.getElementById('taskModal');
    const modalTitle = document.getElementById('modalTitle');
    const taskIdInput = document.getElementById('taskId');
    const titleInput = document.getElementById('taskTitle');
    const descriptionInput = document.getElementById('taskDescription');
    const prioritySelect = document.getElementById('taskPriority');
    const statusSelect = document.getElementById('taskStatus');
    const dueDateInput = document.getElementById('taskDueDate');
    
    if (!modal) {
        console.error('Task modal not found');
        return;
    }
    
    // Clear previous validation
    clearFormValidation();
    
    if (task) {
        // Edit mode
        modalTitle.textContent = 'Edit Task';
        taskIdInput.value = taskId;
        titleInput.value = task.title || '';
        descriptionInput.value = task.description || '';
        prioritySelect.value = task.priority || 'medium';
        statusSelect.value = task.status || 'pending';
        
        if (task.dueDate) {
            const dueDate = new Date(task.dueDate);
            dueDateInput.value = dueDate.toISOString().split('T')[0];
        } else {
            dueDateInput.value = '';
        }
    } else {
        // Create mode
        modalTitle.textContent = 'Create New Task';
        taskIdInput.value = '';
        titleInput.value = '';
        descriptionInput.value = '';
        prioritySelect.value = 'medium';
        statusSelect.value = 'pending';
        
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        dueDateInput.value = '';
        dueDateInput.min = today;
    }
    
    // Show modal
    modal.classList.add('active');
    titleInput.focus();
};

/**
 * 14. CLOSE TASK MODAL - Close modal and reset form
 */
const closeTaskModal = () => {
    const modal = document.getElementById('taskModal');
    const taskForm = document.getElementById('taskForm');
    
    if (modal) {
        modal.classList.remove('active');
    }
    
    if (taskForm) {
        taskForm.reset();
        clearFormValidation();
    }
};

/**
 * 15. HANDLE TASK SUBMIT - Create or update task
 */
const handleTaskSubmit = async (e) => {
    e.preventDefault();
    
    console.log('📝 Submitting task form...');
    
    // Get form elements
    const taskIdInput = document.getElementById('taskId');
    const titleInput = document.getElementById('taskTitle');
    const descriptionInput = document.getElementById('taskDescription');
    const prioritySelect = document.getElementById('taskPriority');
    const statusSelect = document.getElementById('taskStatus');
    const dueDateInput = document.getElementById('taskDueDate');
    
    // Collect form data
    const taskData = {
        title: titleInput.value.trim(),
        description: descriptionInput.value.trim(),
        priority: prioritySelect.value,
        status: statusSelect.value,
        dueDate: dueDateInput.value || undefined
    };
    
    const taskId = taskIdInput.value;
    
    // Validate form
    if (!validateForm()) {
        return;
    }
    
    try {
        setLoading(true);
        
        let response;
        
        if (taskId) {
            // Update existing task
            response = await updateTask(taskId, taskData);
            console.log()
            showMessage('Task updated successfully', 'success');
        } else {
            // Create new task
            response = await createTask(taskData);
            showMessage('Task created successfully', 'success');
        }
        
        // Close modal
        closeTaskModal();
        
        // Refresh tasks
        await refreshTasks();
        
    } catch (error) {
        console.error('Failed to save task:', error);
        showMessage('Failed to save task: ' + error.message, 'error');
    } finally {
        setLoading(false);
    }
};

// ===== FORM VALIDATION =====

/**
 * 16. VALIDATE FORM - Validate task form
 */
const validateForm = () => {
    const titleInput = document.getElementById('taskTitle');
    const descriptionInput = document.getElementById('taskDescription');
    
    let isValid = true;
    
    // Clear previous errors
    clearFormValidation();
    
    // Validate title
    if (!titleInput.value.trim()) {
        showFieldError(titleInput, 'Title is required');
        isValid = false;
    } else if (titleInput.value.length > 200) {
        showFieldError(titleInput, 'Title must be less than 200 characters');
        isValid = false;
    }
    
    // Validate description length
    if (descriptionInput.value.length > 1000) {
        showFieldError(descriptionInput, 'Description must be less than 1000 characters');
        isValid = false;
    }
    
    return isValid;
};

/**
 * 17. SHOW FIELD ERROR - Display field validation error
 */
const showFieldError = (input, message) => {
    input.classList.add('invalid');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'validation-error';
    errorElement.textContent = message;
    
    input.parentNode.appendChild(errorElement);
};

/**
 * 18. CLEAR FORM VALIDATION - Remove validation errors
 */
const clearFormValidation = () => {
    // Remove invalid classes
    document.querySelectorAll('.invalid').forEach(el => {
        el.classList.remove('invalid');
    });
    
    // Remove error messages
    document.querySelectorAll('.validation-error').forEach(el => {
        el.remove();
    });
};

// ===== PAGINATION =====

/**
 * 19. UPDATE PAGINATION - Update pagination controls
 */
const updatePagination = (pagination) => {
    const paginationContainer = document.getElementById('pagination');
    const pageNumbersContainer = document.getElementById('pageNumbers');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    
    if (!pagination || !paginationContainer) {
        return;
    }
    
    const state = getState();
    const currentPage = state.filters.page || 1;
    const totalPages = Math.ceil(state.totalTasks / state.filters.limit);
    
    // Show/hide pagination
    if (totalPages <= 1) {
        paginationContainer.classList.add('hidden');
        return;
    }
    
    paginationContainer.classList.remove('hidden');
    
    // Update previous button
    if (prevPageBtn) {
        prevPageBtn.disabled = currentPage <= 1;
    }
    
    // Update next button
    if (nextPageBtn) {
        nextPageBtn.disabled = currentPage >= totalPages;
    }
    
    // Update page numbers
    if (pageNumbersContainer) {
        let pageNumbersHTML = '';
        const maxVisiblePages = 5;
        
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        // Adjust if we're near the beginning
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        // First page
        if (startPage > 1) {
            pageNumbersHTML += `<button class="page-btn" data-page="1">1</button>`;
            if (startPage > 2) {
                pageNumbersHTML += `<span class="text-gray-500 px-2">...</span>`;
            }
        }
        
        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            const activeClass = i === currentPage ? 'active' : '';
            pageNumbersHTML += `<button class="page-btn ${activeClass}" data-page="${i}">${i}</button>`;
        }
        
        // Last page
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pageNumbersHTML += `<span class="text-gray-500 px-2">...</span>`;
            }
            pageNumbersHTML += `<button class="page-btn" data-page="${totalPages}">${totalPages}</button>`;
        }
        
        pageNumbersContainer.innerHTML = pageNumbersHTML;
        
        // Add click handlers to page buttons
        pageNumbersContainer.querySelectorAll('.page-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = parseInt(e.currentTarget.dataset.page);
                goToPage(page);
            });
        });
    }
};

/**
 * 20. GO TO PAGE - Navigate to specific page
 */
const goToPage = async (page) => {
    const state = getState();
    const newFilters = { ...state.filters, page };
    
    updateState({ filters: newFilters });
    await applyFilters(newFilters);
};

/**
 * 21. GO TO PREVIOUS PAGE
 */
const goToPreviousPage = async () => {
    const state = getState();
    const currentPage = state.filters.page || 1;
    
    if (currentPage > 1) {
        await goToPage(currentPage - 1);
    }
};

/**
 * 22. GO TO NEXT PAGE
 */
const goToNextPage = async () => {
    const state = getState();
    const currentPage = state.filters.page || 1;
    const totalPages = Math.ceil(state.totalTasks / state.filters.limit);
    
    if (currentPage < totalPages) {
        await goToPage(currentPage + 1);
    }
};

// ===== UTILITY FUNCTIONS =====

/**
 * 23. REFRESH TASKS - Reload tasks and stats
 */
const refreshTasks = async () => {
    console.log('🔄 Refreshing tasks...');
    
    try {
        setLoading(true);
        
        // Load tasks and stats
        const [tasksResponse, statsResponse] = await Promise.allSettled([
            getTask(getState().filters),
            getStatisctics()
        ]);
        
        // Update tasks
        if (tasksResponse.status === 'fulfilled') {
            const tasksData = tasksResponse.value;
            updateState({
                tasks: tasksData.data || [],
                totalTasks: tasksData.total || 0
            });
            updateTaskSummary(tasksData);
            updatePagination(tasksData.pagination);
        }
        
        // Update stats
        if (statsResponse.status === 'fulfilled') {
            updateStatistics(statsResponse.value.data);
        }
        
        showMessage('Tasks refreshed', 'success');
        
    } catch (error) {
        console.error('Failed to refresh tasks:', error);
        showMessage('Failed to refresh tasks', 'error');
    } finally {
        setLoading(false);
    }
};

/**
 * 24. UPDATE STATISTICS - Update stats in sidebar
 */
const updateStatistics = (stats) => {
    console.log('📊 Updating statistics:', stats);
    
    // Update status counts
    if (stats.Status) {
        document.getElementById('totalTasks').textContent = stats.overview.tasks || 0;
        document.getElementById('completedTasks').textContent = stats.Status.completed || 0;
        document.getElementById('pendingTasks').textContent = stats.Status.pending || 0;
        document.getElementById('overdueTasks').textContent = stats.overview.overDue

    }
    
    // Update filter counts
    if (stats.Status) {
        document.getElementById('countAll').textContent = stats.Status.total || 0;
        document.getElementById('countPending').textContent = stats.Status.pending || 0;
        document.getElementById('countInProgress').textContent = stats.Status.in_progress || 0;
        document.getElementById('countCompleted').textContent = stats.Status.completed || 0;
    }
    
    // Update priority counts
    if (stats.Priority) {
        document.getElementById('countHigh').textContent = stats.Priority.high || 0;
        document.getElementById('countMedium').textContent = stats.Priority.medium || 0;
        document.getElementById('countLow').textContent = stats.Priority.low || 0;
    }
};

/**
 * 25. UPDATE TASK SUMMARY - Update header text
 */
const updateTaskSummary = (tasksData) => {
    const summaryElement = document.getElementById('tasksSummary');
    const titleElement = document.getElementById('tasksTitle');
    const state = getState();
    
    if (summaryElement) {
        const filterText = state.filters.status ? ` (${state.filters.status})` : '';
        summaryElement.textContent = `${tasksData.count || 0} of ${tasksData.total || 0} tasks${filterText}`;
    }
    
    if (titleElement) {
        if (state.filters.status && state.filters.status !== 'all') {
            titleElement.textContent = `${state.filters.status.replace('_', ' ')} Tasks`;
        } else {
            titleElement.textContent = 'My Tasks';
        }
    }
};

// ===== START THE DASHBOARD =====

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeDashboard);

// Export for testing (optional)
export {
    initializeDashboard,
    refreshTasks,
    applyFilters,
    openTaskModal,
    closeTaskModal
};