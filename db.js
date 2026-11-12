/**
 * Simple LocalStorage Database Simulation
 * NOTE: In a real production application, you should NEVER store passwords
 * in LocalStorage or handle authentication purely on the client side.
 * You would use a backend server (Node.js, PHP, Python) and a real database
 * (MySQL, MongoDB, PostgreSQL) or a service like Firebase.
 */

class UserDatabase {
    constructor() {
        this.dbName = 'codeistan_users_db';
        this.sessionKey = 'codeistan_current_session';
        this.init();
    }

    init() {
        if (!localStorage.getItem(this.dbName)) {
            // Create default test user
            const defaultUsers = [
                {
                    name: 'Admin User',
                    email: 'admin@codeistan.com',
                    password: '123456'
                }
            ];
            localStorage.setItem(this.dbName, JSON.stringify(defaultUsers));
        }
    }

    getUsers() {
        const users = localStorage.getItem(this.dbName);
        return users ? JSON.parse(users) : [];
    }

    saveUsers(users) {
        localStorage.setItem(this.dbName, JSON.stringify(users));
    }

    // New Function to Update User Profile
    updateUser(email, updatedData) {
        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.email === email);

        if (userIndex !== -1) {
            // Merge existing data with new data
            users[userIndex] = { ...users[userIndex], ...updatedData };

            // Save to localStorage (DB)
            this.saveUsers(users);

            // Update current session if the updated user is logged in
            const currentUser = this.getCurrentUser();
            if (currentUser && currentUser.email === email) {
                // Remove password from session data just in case
                const sessionData = { ...users[userIndex] };
                delete sessionData.password;
                localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
            }

            return { success: true, message: 'Profile updated successfully' };
        }

        return { success: false, message: 'User not found' };
    }
    /**
     * Register a new user
     * @returns {Object} result - { success: boolean, message: string }
     */
    register(user) {
        const users = this.getUsers();

        // Check if email already exists
        if (users.find(u => u.email === user.email)) {
            return {
                success: false,
                message: 'ئەم ئیمەیڵە پێشتر تۆمارکراوە' // Email already exists
            };
        }

        // Add new user
        users.push(user);
        this.saveUsers(users);

        // Auto login after register
        this.startSession(user);

        return {
            success: true,
            message: 'تۆمارکردن سەرکەوتوو بوو' // Registration successful
        };
    }

    /**
     * Login a user
     * @returns {Object} result - { success: boolean, message: string }
     */
    login(email, password) {
        const users = this.getUsers();
        // Check for email first
        const userByEmail = users.find(u => u.email === email);

        if (!userByEmail) {
            return {
                success: false,
                message: 'ئیمەیڵەکە هەڵەیە' // Email is incorrect
            };
        }

        // Then check password
        if (userByEmail.password !== password) {
            return {
                success: false,
                message: 'وشەی نهێنی هەڵەیە' // Password is incorrect
            };
        }

        // Login successful
        this.startSession(userByEmail);
        return {
            success: true,
            message: 'بەخێربێیتەوە' // Welcome back
        };
    }

    startSession(user) {
        // Store current user session (excluding password)
        const sessionUser = { ...user };
        delete sessionUser.password;
        localStorage.setItem(this.sessionKey, JSON.stringify(sessionUser));
    }

    endSession() {
        localStorage.removeItem(this.sessionKey);
    }

    isLoggedIn() {
        return localStorage.getItem(this.sessionKey) !== null;
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem(this.sessionKey));
    }
}

const db = new UserDatabase();
