// api.js - API Integration Helper
// Add this to your HTML: <script src="api.js"></script>

const API_CONFIG = {
    baseURL: 'http://localhost:5000/api',
    timeout: 10000
};

// Get token from localStorage
function getToken() {
    return localStorage.getItem('token');
}

// Get current user from localStorage
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

// Check if user is authenticated
function isAuthenticated() {
    return !!getToken();
}

// Logout user
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Generic API request helper
async function apiRequest(endpoint, options = {}) {
    const token = getToken();
    
    const config = {
        method: options.method || 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        }
    };

    if (options.body) {
        config.body = JSON.stringify(options.body);
    }

    try {
        const response = await fetch(`${API_CONFIG.baseURL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            // Token expired or invalid
            if (response.status === 401 || response.status === 403) {
                logout();
                throw new Error('Session expired. Please login again.');
            }
            throw new Error(data.error || 'Request failed');
        }

        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

// ===== AUTH API =====

const AuthAPI = {
    async login(email, password) {
        const data = await apiRequest('/auth/login', {
            method: 'POST',
            body: { email, password }
        });
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data;
    },

    async register(userData) {
        const data = await apiRequest('/auth/register', {
            method: 'POST',
            body: userData
        });
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data;
    },

    async getCurrentUser() {
        return await apiRequest('/auth/me');
    },

    logout() {
        logout();
    }
};

// ===== CHECK-IN API =====

const CheckInAPI = {
    async create(checkInData) {
        return await apiRequest('/checkins', {
            method: 'POST',
            body: checkInData
        });
    },

    async getMyCheckIns() {
        return await apiRequest('/checkins/my');
    },

    async getTodayCheckIns() {
        return await apiRequest('/checkins/today');
    },

    async submitFeedback(checkInId, rating, feedback) {
        return await apiRequest(`/checkins/${checkInId}/feedback`, {
            method: 'POST',
            body: { rating, feedback }
        });
    }
};

// ===== MENU API =====

const MenuAPI = {
    async getWeeklyMenu() {
        return await apiRequest('/menu/weekly');
    }
};

// ===== MESSAGE API =====

const MessageAPI = {
    async getMessages(channel = 'general') {
        return await apiRequest(`/messages/${channel}`);
    },

    async sendMessage(content, channel = 'general') {
        return await apiRequest('/messages', {
            method: 'POST',
            body: { content, channel }
        });
    }
};

// ===== ANALYTICS API =====

const AnalyticsAPI = {
    async getMyAnalytics() {
        return await apiRequest('/analytics/my');
    },

    async getLeaderboard() {
        return await apiRequest('/leaderboard');
    }
};

// ===== SOCKET.IO CONNECTION =====

let socket = null;

function connectSocket() {
    if (!isAuthenticated()) return;

    socket = io('http://localhost:5000', {
        auth: {
            token: getToken()
        }
    });

    socket.on('connect', () => {
        console.log('✅ Connected to real-time server');
    });

    socket.on('disconnect', () => {
        console.log('❌ Disconnected from real-time server');
    });

    socket.on('newMessage', (message) => {
        // Handle new message
        handleNewMessage(message);
    });

    return socket;
}

function disconnectSocket() {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}

// ===== USAGE EXAMPLES =====

/*

// Example 1: Check-in for a meal
async function checkInForMeal() {
    try {
        const result = await CheckInAPI.create({
            mealType: 'lunch',
            mealName: 'Dal Tadka + Rice',
            nutritionData: {
                calories: 480,
                protein: 18,
                carbs: 72,
                fat: 12
            }
        });
        
        console.log('Check-in successful:', result);
        alert(`Check-in successful! Earned ${result.updatedStats.ecoPoints} eco points`);
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Example 2: Get today's check-in status
async function getTodayStatus() {
    try {
        const status = await CheckInAPI.getTodayCheckIns();
        console.log('Today status:', status);
        // Returns: { breakfast: false, lunch: true, dinner: false }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Example 3: Send a message
async function sendChatMessage() {
    try {
        const message = await MessageAPI.sendMessage(
            'Hey everyone! The lunch today is amazing!',
            'general'
        );
        console.log('Message sent:', message);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Example 4: Get analytics
async function loadAnalytics() {
    try {
        const analytics = await AnalyticsAPI.getMyAnalytics();
        console.log('My analytics:', analytics);
        // Use this data to populate charts
    } catch (error) {
        console.error('Error:', error);
    }
}

// Example 5: Connect to real-time chat
function initializeChat() {
    connectSocket();
    
    socket.on('newMessage', (message) => {
        // Add message to chat UI
        addMessageToChat(message);
    });
}

*/

// ===== UTILITY FUNCTIONS =====

// Update user data in localStorage after API calls
function updateUserInLocalStorage(updates) {
    const user = getCurrentUser();
    if (user) {
        const updatedUser = { ...user, ...updates };
        localStorage.setItem('user', JSON.stringify(updatedUser));
    }
}

// Format date for display
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Format time for display
function formatTime(date) {
    return new Date(date).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
    });
}

// Check if user can check in for a meal
function canCheckIn(mealType, checkedMeals) {
    const now = new Date();
    const hour = now.getHours();

    const deadlines = {
        breakfast: 9,
        lunch: 14,
        dinner: 21
    };

    return hour < deadlines[mealType] && !checkedMeals[mealType];
}

// Calculate streak days
function calculateStreak(checkIns) {
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        const hasCheckIn = checkIns.some(checkIn => {
            const checkInDate = new Date(checkIn.date);
            checkInDate.setHours(0, 0, 0, 0);
            return checkInDate.getTime() === date.getTime();
        });

        if (hasCheckIn) {
            streak++;
        } else {
            break;
        }
    }

    return streak;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AuthAPI,
        CheckInAPI,
        MenuAPI,
        MessageAPI,
        AnalyticsAPI,
        getToken,
        getCurrentUser,
        isAuthenticated,
        logout,
        connectSocket,
        disconnectSocket
    };
}
