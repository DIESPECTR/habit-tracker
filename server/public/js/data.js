/**
 * Data Layer - Habits Storage & Logic
 * Updated for Telegram Mini App Sync
 */

const HabitStore = {
    STORAGE_KEY: 'habits_v2',
    API_URL: '/api',
    syncTimer: null,
    isInit: false,
    
    // Initialize: Check TG and sync
    async init() {
        if (this.isInit) return;
        this.isInit = true;

        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.ready();
            window.Telegram.WebApp.expand();
            
            // Try to sync from server on startup
            await this.syncFromServer();
        }
    },

    // Sync from server (Download)
    async syncFromServer() {
        if (!this.getTgInitData()) return;

        try {
            const response = await fetch(`${this.API_URL}/data`, {
                headers: { 'Authorization': this.getTgInitData() }
            });
            
            if (response.ok) {
                const data = await response.json();
                const localData = this.getAll();

                if (data.habits && Array.isArray(data.habits) && data.habits.length > 0) {
                    // Server has data -> Overwrite local
                    // (In a real app, you'd merge based on timestamps)
                    console.log('Downloaded data from server:', data.habits.length, 'habits');
                    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data.habits));
                    // Dispatch event to update UI if App is listening
                    window.dispatchEvent(new CustomEvent('habit-data-updated'));
                } else if (localData.length > 0) {
                     // Server is empty, but Local has data -> Push Local to Server
                     console.log('Server empty, pushing local data...');
                     this.sync(); 
                }
            }
        } catch (e) {
            console.error('Sync download failed:', e);
        }
    },

    // Sync to server (Upload)
    sync() {
        if (!this.getTgInitData()) return;

        // Debounce
        if (this.syncTimer) clearTimeout(this.syncTimer);
        this.syncTimer = setTimeout(async () => {
            try {
                const habits = this.getAll();
                await fetch(`${this.API_URL}/sync`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': this.getTgInitData()
                    },
                    body: JSON.stringify({ habits })
                });
                console.log('Synced to server');
            } catch (e) {
                console.error('Sync upload failed:', e);
            }
        }, 1000); // Wait 1s after last change
    },

    getTgInitData() {
        if (window.Telegram && window.Telegram.WebApp) {
            return window.Telegram.WebApp.initData;
        }
        return null;
    },

    // Get all habits
    getAll() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },
    
    // Save all habits
    saveAll(habits) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(habits));
        this.sync(); // Trigger sync
    },
    
    // Get single habit
    get(id) {
        return this.getAll().find(h => h.id === id);
    },
    
    // Premium Neon Palette (10 Safe Colors)
    PALETTE: [
        '#2997FF', // Electric Blue
        '#32D74B', // Acid Green
        '#FF375F', // Hot Pink
        '#BF5AF2', // Electric Violet
        '#FF9F0A', // Sunset Orange
        '#64D2FF', // Cyan
        '#FFD60A', // Sunny Yellow
        '#5E5CE6', // Indigo
        '#FF453A', // Neon Red (New)
        '#66D4CF'  // Mint Teal (New)
    ],

    // Get random color from palette
    getRandomColor() {
        return this.PALETTE[Math.floor(Math.random() * this.PALETTE.length)];
    },
    
    // Create habit
    create(habit) {
        const habits = this.getAll();
        const newHabit = {
            id: crypto.randomUUID(),
            name: habit.name,
            icon: habit.icon || '📌',
            frequency: habit.frequency || 'daily',
            goalPerWeek: habit.goalPerWeek || 7,
            color: habit.color || this.getRandomColor(), // Use random neon color
            createdAt: new Date().toISOString(),
            logs: {} // { 'YYYY-MM-DD': true }
        };
        habits.push(newHabit);
        this.saveAll(habits);
        return newHabit;
    },
    
    // Update habit
    update(id, updates) {
        const habits = this.getAll();
        const idx = habits.findIndex(h => h.id === id);
        if (idx !== -1) {
            habits[idx] = { ...habits[idx], ...updates };
            this.saveAll(habits);
            return habits[idx];
        }
        return null;
    },
    
    // Delete habit
    delete(id) {
        const habits = this.getAll().filter(h => h.id !== id);
        this.saveAll(habits);
    },
    
    // Toggle day for habit
    toggleDay(id, dateStr) {
        const habits = this.getAll();
        const habit = habits.find(h => h.id === id);
        if (habit) {
            if (habit.logs[dateStr]) {
                delete habit.logs[dateStr];
            } else {
                habit.logs[dateStr] = true;
            }
            this.saveAll(habits);
            return habit;
        }
        return null;
    },
    
    // Calculate current streak
    getStreak(habit) {
        const todayStr = this.getTodayStr();
        const yesterday = new Date(this.strToDate(todayStr));
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = this.dateToStr(yesterday);
        
        let streak = 0;
        let current = this.strToDate(todayStr);
        
        // If done today, start counting. If not, check yesterday.
        if (habit.logs && habit.logs[todayStr]) {
            streak++;
            current.setDate(current.getDate() - 1);
        } else if (habit.logs && habit.logs[yesterdayStr]) {
            // Not done today, but done yesterday - streak is alive
            current.setDate(current.getDate() - 1);
        } else {
            // Streak broken
            return 0;
        }
        
        // Count backwards
        while (true) {
            const dateStr = this.dateToStr(current);
            if (habit.logs && habit.logs[dateStr]) {
                streak++;
                current.setDate(current.getDate() - 1);
            } else {
                // Check if we already counted this day (e.g. initial check)
                // Actually my logic above is slightly flawed for loop.
                // Let's simplify.
                break;
            }
        }
        
        // Re-implement simpler logic
        let count = 0;
        let d = this.strToDate(todayStr);
        
        // Check today
        if (habit.logs && habit.logs[this.dateToStr(d)]) {
            count++;
        } else {
            // If not today, maybe yesterday?
            d.setDate(d.getDate() - 1);
            if (!(habit.logs && habit.logs[this.dateToStr(d)])) {
                return 0; 
            }
            // If yesterday is done, count it and continue
            count++;
        }
        
        // Continue backwards from d-1
        while (true) {
            d.setDate(d.getDate() - 1);
            if (habit.logs && habit.logs[this.dateToStr(d)]) {
                count++;
            } else {
                break;
            }
        }
        return count;
    },

    // Calculate best streak
    getBestStreak(habit) {
        const dates = Object.keys(habit.logs).sort();
        if (dates.length === 0) return 0;
        
        let best = 0;
        let current = 0;
        let prevDate = null;
        
        for (const dateStr of dates) {
            if (prevDate) {
                // Use strToDate for consistent Local Midnight comparison
                const prev = this.strToDate(prevDate);
                const curr = this.strToDate(dateStr);
                const diff = (curr - prev) / (1000 * 60 * 60 * 24);
                
                if (diff === 1) {
                    current++;
                } else {
                    current = 1;
                }
            } else {
                current = 1;
            }
            
            best = Math.max(best, current);
            prevDate = dateStr;
        }
        
        return best;
    },
    
    // Get completion for current week
    getWeekCompletion(habit) {
        const weekDates = this.getWeekDates();
        const done = weekDates.filter(d => habit.logs[d]).length;
        return { done, total: habit.goalPerWeek };
    },
    
    // Date helpers - Local Timezone
    // Returns YYYY-MM-DD in local time
    dateToStr(date) {
        // 'sv-SE' locale format is YYYY-MM-DD
        return date.toLocaleDateString('sv-SE');
    },

    // Get current date string in Cyprus
    getTodayStr() {
        return this.dateToStr(new Date());
    },
    
    // Create a Date object (Local Midnight) from YYYY-MM-DD string
    // This allows safe day iteration/math regardless of real timezone
    strToDate(str) {
        const [y, m, d] = str.split('-').map(Number);
        return new Date(y, m - 1, d); // Local midnight
    },
    
    // Get heatmap data for year (dynamic start)
    getYearHeatmap() {
        const habits = this.getAll();
        const todayStr = this.getTodayStr();
        const today = this.strToDate(todayStr);
        
        // Start from Jan 1 of current year
        const startDate = new Date(today.getFullYear(), 0, 1);
        
        const data = {};
        const current = new Date(startDate);
        
        while (current <= today) {
            const dateStr = this.dateToStr(current); 
            const iterYear = current.getFullYear();
            const iterMonth = String(current.getMonth() + 1).padStart(2, '0');
            const iterDay = String(current.getDate()).padStart(2, '0');
            const iterStr = `${iterYear}-${iterMonth}-${iterDay}`;
            
            const total = habits.length;
            const done = habits.filter(h => h.logs && h.logs[iterStr]).length;
            
            let level = 0;
            if (total > 0) {
                const pct = done / total;
                if (pct > 0) level = 1;
                if (pct >= 0.25) level = 2;
                if (pct >= 0.5) level = 3;
                if (pct >= 0.75) level = 4;
            }
            
            data[iterStr] = { done, total, level };
            current.setDate(current.getDate() + 1);
        }
        
        return data;
    },
    
    // Get trend data for chart
    getTrendData(days = 90) {
        const allHabits = this.getAll();
        const habits = allHabits.slice(0, 5);
        
        const todayStr = this.getTodayStr();
        const today = this.strToDate(todayStr);
        
        // Dynamic start date (Jan 1 of current year)
        const startDate = new Date(today.getFullYear(), 0, 1); 
        const data = { dates: [], series: [] };
        
        const actualDays = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24)) + 1;
        const daysToShow = Math.min(days, actualDays);
        
        let chartStart;
        if (daysToShow < actualDays) {
            chartStart = new Date(today);
            chartStart.setDate(today.getDate() - (daysToShow - 1));
        } else {
            chartStart = new Date(startDate);
        }
        
        const current = new Date(chartStart);
        while (current <= today) {
            const iterYear = current.getFullYear();
            const iterMonth = String(current.getMonth() + 1).padStart(2, '0');
            const iterDay = String(current.getDate()).padStart(2, '0');
            const iterStr = `${iterYear}-${iterMonth}-${iterDay}`;
            
            data.dates.push(iterStr);
            current.setDate(current.getDate() + 1);
        }
        
        habits.forEach(habit => {
            const values = data.dates.map(dateStr => {
                return (habit.logs && habit.logs[dateStr]) ? 1 : 0;
            });
            
            const rolling = values.map((_, i) => {
                let sum = 0;
                for (let j = Math.max(0, i - 6); j <= i; j++) {
                    sum += values[j];
                }
                return sum;
            });
            
            data.series.push({
                id: habit.id,
                name: habit.name,
                color: habit.color,
                values: rolling
            });
        });
        
        return data;
    },
    
    // Get week dates (Mon-Sun) anchored to Cyprus Today
    getWeekDates() {
        const todayStr = this.getTodayStr();
        const today = this.strToDate(todayStr);
        
        const day = (today.getDay() + 6) % 7; // 0 = Monday
        const dates = [];
        
        for (let i = 0; i < 7; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() - day + i);
            
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const da = String(d.getDate()).padStart(2, '0');
            dates.push(`${y}-${m}-${da}`);
        }
        
        return dates;
    },
    
    // Export all data
    exportData() {
        return {
            version: 2,
            exportedAt: new Date().toISOString(),
            habits: this.getAll()
        };
    },
    
    // Import data
    importData(json) {
        try {
            const data = typeof json === 'string' ? JSON.parse(json) : json;
            if (data.habits && Array.isArray(data.habits)) {
                this.saveAll(data.habits);
                return true;
            }
        } catch (e) {
            console.error('Import failed:', e);
        }
        return false;
    },
    
    // Reset all
    async reset() {
        localStorage.removeItem(this.STORAGE_KEY);
        
        // Force immediate sync to server (bypass debounce)
        if (this.getTgInitData()) {
            try {
                await fetch(`${this.API_URL}/sync`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': this.getTgInitData()
                    },
                    body: JSON.stringify({ habits: [] })
                });
            } catch (e) {
                console.error('Reset sync failed:', e);
            }
        }
        
        window.location.reload();
    },
    
    // Load demo data - DISABLED / CLEARED for Onboarding
    loadDemo() {
        // Just reload to clear if needed, or do nothing.
        // User requested removing auto-generated demo items.
        // We will keep the method empty to prevent accidental load.
        this.saveAll([]); // Clear all habits
        window.location.reload();
    }
};
