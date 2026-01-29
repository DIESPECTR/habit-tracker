/**
 * App Controller - UI Logic
 */

// SVG Icons Mapping (Lucide / Feather style)
const ICONS = {
    // Health & Fitness
    'gym': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6.5 6.5 11 11"></path><path d="m21 21-1-1"></path><path d="m3 3 1 1"></path><path d="m18 22 4-4"></path><path d="m2 6 4-4"></path><path d="m3 10 7-7"></path><path d="m14 21 7-7"></path></svg>',
    'run': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>', // Flag as placeholder for run, actually looks like flag. Let's use Activity instead.
    'activity': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>',
    'walk': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 4v7l-3 2v6"></path><path d="M17 10l-2-6-4 1-2 7"></path><circle cx="13" cy="2" r="2"></circle></svg>', // Rough walk stickman
    'swim': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h20"></path><path d="M2 16h20"></path><path d="M2 8h20"></path><path d="M12 4v4"></path></svg>', // Waves
    'cycle': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="5.5" cy="17.5" r="3.5"></circle><circle cx="18.5" cy="17.5" r="3.5"></circle><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2"></path></svg>',
    'yoga': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4" r="2"></circle><path d="M4 20l4-2v-4l2-2 2 2v4l4 2"></path></svg>', // Rough standing pose
    'vitamins': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"></path><path d="m8.5 8.5 7 7"></path></svg>',
    'water': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.74 5.88a6 6 0 0 1-8.48 8.48A6 6 0 0 1 3.52 8.57L9.26 2.69a4 4 0 0 1 2.74-1.18V2.69z"></path><circle cx="12" cy="14" r="2"></circle></svg>',
    'food': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8z"></path><path d="M15 11l-3 3"></path></svg>', // Apple-ish
    'sleep': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>', // Moon
    
    // Productivity & Work
    'reading': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>',
    'journal': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>',
    'work': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>',
    'code': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>',
    'focus': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>',
    'goal': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>',
    'time': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
    'idea': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M12 2v1"></path><path d="M12 17v-1"></path><path d="M5.6 5.6l.7.7"></path><path d="M18.4 5.6l-.7.7"></path><path d="M4 12h1"></path><path d="M19 12h1"></path></svg>', // Bulb-ish parts
    
    // Lifestyle & Hobby
    'meditate': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a8 8 0 0 1 8 8c0 4-3 7-6 8v3h-4v-3c-3-1-6-4-6-8a8 8 0 0 1 8-8z"></path></svg>', // Rough head/mind
    'money': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>',
    'music': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>',
    'art': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>', // Brush
    'game': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"></rect><path d="M6 12h4"></path><path d="M8 10v4"></path><line x1="15" y1="13" x2="15.01" y2="13"></line><line x1="18" y1="11" x2="18.01" y2="11"></line></svg>',
    'clean': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"></path><path d="M18 3l-18 18"></path><circle cx="12" cy="12" r="9"></circle></svg>', // Sparkle/Cross
    'home': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',
    'family': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
    'travel': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M2 12h20"></path><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>', // Globe
    
    // Misc
    'phone': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>',
    'no-phone': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line><line x1="2" y1="2" x2="22" y2="22"></line></svg>',
    'sun': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>',
    'default': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>' 
};

// Helper to get SVG based on emoji or name
function getIconSvg(iconStr) {
    if (!iconStr) return ICONS['default'];
    const lower = iconStr.toLowerCase();
    
    // Direct match (if user selected a key directly)
    if (ICONS[lower]) return ICONS[lower];

    // Smart Mapping
    if (lower.includes('read') || lower.includes('book') || iconStr.includes('📚')) return ICONS['reading'];
    if (lower.includes('gym') || lower.includes('workout') || lower.includes('weight') || iconStr.includes('🏋️') || iconStr.includes('💪')) return ICONS['gym'];
    if (lower.includes('run') || iconStr.includes('🏃')) return ICONS['activity'];
    if (lower.includes('walk') || iconStr.includes('🚶')) return ICONS['walk'];
    if (lower.includes('swim') || iconStr.includes('🏊')) return ICONS['swim'];
    if (lower.includes('cycle') || lower.includes('bike') || iconStr.includes('🚴')) return ICONS['cycle'];
    if (lower.includes('yoga') || iconStr.includes('🧘')) return ICONS['yoga'];
    if (lower.includes('vit') || lower.includes('pill') || iconStr.includes('💊') || iconStr.includes('🍊')) return ICONS['vitamins'];
    if (lower.includes('water') || lower.includes('drink') || iconStr.includes('💧')) return ICONS['water'];
    if (lower.includes('eat') || lower.includes('food') || iconStr.includes('🍎') || iconStr.includes('🥗')) return ICONS['food'];
    if (lower.includes('sleep') || lower.includes('bed') || iconStr.includes('😴') || iconStr.includes('🌙')) return ICONS['sleep'];
    if (lower.includes('journal') || lower.includes('write') || iconStr.includes('📝') || iconStr.includes('🖊️')) return ICONS['journal'];
    if (lower.includes('work') || lower.includes('office') || iconStr.includes('💼')) return ICONS['work'];
    if (lower.includes('code') || lower.includes('dev') || iconStr.includes('💻')) return ICONS['code'];
    if (lower.includes('focus') || iconStr.includes('🎯')) return ICONS['focus'];
    if (lower.includes('medita') || lower.includes('mind') || iconStr.includes('🧠')) return ICONS['meditate'];
    if (lower.includes('money') || lower.includes('sav') || iconStr.includes('💰') || iconStr.includes('💵')) return ICONS['money'];
    if (lower.includes('music') || iconStr.includes('🎵') || iconStr.includes('🎧')) return ICONS['music'];
    if (lower.includes('art') || lower.includes('draw') || iconStr.includes('🎨')) return ICONS['art'];
    if (lower.includes('game') || iconStr.includes('🎮')) return ICONS['game'];
    if (lower.includes('clean') || iconStr.includes('🧹') || iconStr.includes('✨')) return ICONS['clean'];
    if (lower.includes('home') || lower.includes('house') || iconStr.includes('🏠')) return ICONS['home'];
    if (lower.includes('family') || iconStr.includes('👨‍👩‍👧')) return ICONS['family'];
    if (lower.includes('travel') || iconStr.includes('✈️') || iconStr.includes('🌍')) return ICONS['travel'];
    if (lower.includes('no phone') || lower.includes('disconnect') || iconStr.includes('📵')) return ICONS['no-phone'];
    if (lower.includes('phone') || iconStr.includes('📱')) return ICONS['phone'];
    if (lower.includes('early') || lower.includes('sun') || iconStr.includes('☀️')) return ICONS['sun'];

    // Fallback: If it's a short string (emoji), wrap it
    if (iconStr.length < 5) return `<span style="font-size: 24px;">${iconStr}</span>`;
    return ICONS['default']; 
}

const QUOTES = [
    "Habits are the compound interest of self-improvement.",
    "It does not matter how slowly you go as long as you do not stop.",
    "Success is the sum of small efforts, repeated day in and day out.",
    "The man who moves a mountain begins by carrying away small stones.",
    "Results happen over time, not overnight. Stay consistent.",
    "River cuts through rock not because of power, but because of persistence.",
    "Do something today that your future self will thank you for."
];

const App = {
    chart: null,
    quoteInterval: null,
    currentQuoteIdx: 0,
    
    init() {
        // Init Data Store (Async sync)
        HabitStore.init();

        // Listen for sync updates
        window.addEventListener('habit-data-updated', () => {
            console.log('UI updated from server sync');
            this.render();
        });

        /* Service Worker Disabled for Stability
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js').then(reg => {
                // ... (code commented out)
            }).catch(err => console.error('SW Fail:', err));
        }
        */

        // Auto-fix: Migrate to Neon Palette (One-time)
        if (!localStorage.getItem('migrated_neon_palette_v2')) {
            const habits = HabitStore.getAll();
            if (habits.length > 0) {
                habits.forEach((h, i) => {
                    h.color = HabitStore.PALETTE[i % HabitStore.PALETTE.length];
                });
                HabitStore.saveAll(habits);
                console.log('Auto-Fix: Migrated all habits to Neon Palette');
            }
            localStorage.setItem('migrated_neon_palette_v2', 'true');
        }
        
        this.bindEvents();
        this.render();
        this.startQuoteRotation();
        
        // Auto-refresh on date change (every 1 min check)
        this.lastRenderedDate = HabitStore.getTodayStr();
        setInterval(() => {
            const currentToday = HabitStore.getTodayStr();
            if (currentToday !== this.lastRenderedDate) {
                console.log('Date changed to ' + currentToday + ', refreshing...');
                this.lastRenderedDate = currentToday;
                this.render();
            }
        }, 60000);

        this.checkBackupReminder();
    },

    // Haptic Feedback Helper
    vibrate() {
        try {
            if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
            } else if (navigator.vibrate) {
                navigator.vibrate(10); // Fallback
            }
        } catch (e) {
            // Ignore vibration errors to not break UI flow
            console.warn('Vibrate failed', e);
        }
    },

    // Check for daily completion celebration
    checkCompletion() {
        const habits = HabitStore.getAll();
        const today = HabitStore.getTodayStr();
        const total = habits.length;
        
        if (total === 0) return;

        const done = habits.filter(h => h.logs[today]).length;
        
        if (done === total) {
            // Trigger Confetti
            if (typeof confetti === 'function') {
                const colors = ['#A78BFA', '#4ADE80', '#FACC15', '#4A9EFF'];
                
                // Fire from left
                confetti({
                    particleCount: 60,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: colors
                });
                
                // Fire from right
                confetti({
                    particleCount: 60,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: colors
                });
            }
        }
    },
    
    // Check if backup is needed (weekly)
    checkBackupReminder() {
        const lastBackup = localStorage.getItem('habit_last_backup');
        const btn = document.getElementById('btn-settings');
        
        if (!lastBackup) {
            // New user or never backed up - show dot after a few days? 
            // Or immediately if they have data.
            if (HabitStore.getAll().length > 0) {
                btn.classList.add('notification');
            }
            return;
        }
        
        const diff = (new Date() - new Date(lastBackup)) / (1000 * 60 * 60 * 24);
        if (diff > 7) {
            btn.classList.add('notification');
        } else {
            btn.classList.remove('notification');
        }
    },
    
    bindEvents() {
        // New habit button
        document.getElementById('btn-new-habit').addEventListener('click', () => {
            this.vibrate();
            this.openHabitModal();
        });
        
        // Settings button
        document.getElementById('btn-settings').addEventListener('click', () => {
            this.vibrate();
            document.getElementById('settings-modal').classList.add('active');
        });
        
        // Modal close buttons
        document.getElementById('modal-close').addEventListener('click', () => {
            document.getElementById('habit-modal').classList.remove('active');
        });
        
        document.getElementById('settings-close').addEventListener('click', () => {
            document.getElementById('settings-modal').classList.remove('active');
        });
        
        document.getElementById('day-modal-close').addEventListener('click', () => {
            document.getElementById('day-modal').classList.remove('active');
        });
        
        document.getElementById('btn-cancel').addEventListener('click', () => {
            document.getElementById('habit-modal').classList.remove('active');
        });

        // Delete habit
        document.getElementById('btn-delete-habit').addEventListener('click', () => {
            const id = document.getElementById('habit-id').value;
            if (id && confirm('Delete this habit? This cannot be undone.')) {
                HabitStore.delete(id);
                document.getElementById('habit-modal').classList.remove('active');
                this.render();
            }
        });
        
        // Form submit
        document.getElementById('habit-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveHabit();
        });
        
        // Settings actions
        document.getElementById('btn-export').addEventListener('click', () => {
            this.exportData();
        });
        
        document.getElementById('btn-import').addEventListener('click', () => {
            document.getElementById('import-file').click();
        });
        
        document.getElementById('import-file').addEventListener('change', (e) => {
            this.importData(e.target.files[0]);
        });
        
        document.getElementById('btn-load-demo').addEventListener('click', () => {
            HabitStore.loadDemo();
            this.render();
            document.getElementById('settings-modal').classList.remove('active');
        });
        
        document.getElementById('btn-reset').addEventListener('click', () => {
            if (confirm('Reset all data? This cannot be undone.')) {
                HabitStore.reset();
                HabitStore.loadDemo();
                this.render();
                document.getElementById('settings-modal').classList.remove('active');
            }
        });
        
        // Close modals on backdrop click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });
        

        // Habits view tabs
        document.querySelectorAll('#habits-tabs .tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchHabitsView(tab.dataset.view);
            });
        });

        // --- Event Delegation for Habits Grid (Fix for dynamic elements) ---
        const grid = document.getElementById('habits-grid');
        grid.addEventListener('click', (e) => {
            // 1. Check Button
            const btn = e.target.closest('.habit-check-btn');
            if (btn) {
                e.stopPropagation();
                this.vibrate();
                const habitId = btn.dataset.habit;
                const dateStr = btn.dataset.date;
                HabitStore.toggleDay(habitId, dateStr);
                this.render();
                this.checkCompletion();
                return;
            }

            // 2. Check Day Column (Dot)
            const col = e.target.closest('.habit-day-col');
            if (col) {
                e.stopPropagation();
                this.vibrate();
                const habitId = col.dataset.habit;
                const dateStr = col.dataset.date;
                HabitStore.toggleDay(habitId, dateStr);
                this.render();
                this.checkCompletion();
                return;
            }

            // 3. Check Card (Edit)
            const card = e.target.closest('.habit-card');
            if (card) {
                const habitId = card.dataset.id;
                this.vibrate();
                this.openHabitModal(habitId);
            }
        });
        
        // Log view tabs
        document.querySelectorAll('#log-tabs .log-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchLogView(tab.dataset.view);
            });
        });

        // Handle window resize for chart
        window.addEventListener('resize', () => {
            if (this.logView === 'chart') {
                this.renderChart();
            }
        });
    },
    
    startQuoteRotation() {
        if (this.quoteInterval) clearInterval(this.quoteInterval);
        
        // Rotate every 60 seconds
        this.quoteInterval = setInterval(() => {
            const habits = HabitStore.getAll();
            // Only rotate if we are in "Inspiration Mode" (<= 5 habits)
            if (habits.length <= 5) {
                this.rotateQuote();
            }
        }, 60000);
    },

    rotateQuote() {
        const quoteEl = document.getElementById('quote-container');
        if (!quoteEl) return;

        // Fade out
        quoteEl.classList.add('fade-out');

        setTimeout(() => {
            // Change text
            this.currentQuoteIdx = (this.currentQuoteIdx + 1) % QUOTES.length;
            quoteEl.innerHTML = `"${QUOTES[this.currentQuoteIdx]}"`;
            
            // Fade in
            quoteEl.classList.remove('fade-out');
        }, 800); // Wait for CSS transition
    },

    initOnboarding() {
        if (this.onboardingObserver) return; // Already init
        
        const slides = document.getElementById('onboarding-slides');
        const dots = document.querySelectorAll('.onboarding-pagination .dot');
        const prevBtn = document.getElementById('onboarding-prev');
        const nextBtn = document.getElementById('onboarding-next');
        
        if (!slides || dots.length === 0) return;
        
        this.onboardingObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const idx = Array.from(slides.children).indexOf(entry.target);
                    // Update Dots
                    dots.forEach(d => d.classList.remove('active'));
                    if (dots[idx]) dots[idx].classList.add('active');
                    
                    // Update Arrows
                    if (prevBtn && nextBtn) {
                        prevBtn.style.display = idx === 0 ? 'none' : 'flex';
                        nextBtn.style.display = idx === slides.children.length - 1 ? 'none' : 'flex';
                    }
                    
                    console.log(`Onboarding slide changed to: ${idx}`);
                }
            });
        }, { threshold: 0.5, root: slides.parentElement });
        
        Array.from(slides.children).forEach(slide => this.onboardingObserver.observe(slide));
        
        // Add click events to dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.vibrate();
                if (slides.children[index]) {
                    slides.children[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }
            });
        });
        
        // Add click events to arrows
        if (prevBtn && nextBtn) {
            prevBtn.onclick = () => {
                this.vibrate();
                slides.scrollBy({ left: -slides.offsetWidth, behavior: 'smooth' });
            };
            nextBtn.onclick = () => {
                this.vibrate();
                slides.scrollBy({ left: slides.offsetWidth, behavior: 'smooth' });
            };
        }
    },

    render() {
        const habits = HabitStore.getAll();
        
        // --- ONBOARDING LOGIC ---
        if (!habits || habits.length === 0) {
            // Hide main sections
            ['today-section', 'log-section', 'habits-section'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.style.display = 'none';
            });
            
            // Show onboarding
            const onboarding = document.getElementById('onboarding-section');
            if (onboarding) {
                onboarding.style.display = 'flex';
                const btnStart = document.getElementById('btn-start-onboarding');
                if (btnStart) {
                    btnStart.onclick = () => {
                        this.vibrate();
                        this.openHabitModal();
                    };
                }
                
                // Initialize Carousel
                setTimeout(() => this.initOnboarding(), 100);
            }
            return; // Stop rendering the rest
        }
        
        // If habits exist -> Show main app, hide onboarding
        ['today-section', 'log-section', 'habits-section'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'block'; 
        });
        document.getElementById('onboarding-section').style.display = 'none';

        try {
            this.renderHabits();
        } catch (e) {
            console.error('Error rendering habits:', e);
        }

        try {
            this.renderTodayProgress();
        } catch (e) {
            console.error('Error rendering today progress:', e);
        }

        try {
            this.renderCalendar();
        } catch (e) {
            console.error('Error rendering calendar:', e);
        }
        
        // Defer chart rendering to ensure DOM layout is stable
        requestAnimationFrame(() => {
            try {
                this.renderChart();
            } catch (e) {
                console.error('Error rendering chart:', e);
            }
        });
    },

    renderTodayProgress() {
        const habits = HabitStore.getAll();
        const today = HabitStore.getTodayStr();
        
        // Dynamic Greeting
        const hour = new Date().getHours();
        let greeting = 'Good Morning';
        if (hour >= 12) greeting = 'Good Afternoon';
        if (hour >= 18) greeting = 'Good Evening';
        
        const dateObj = new Date();
        const dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        
        // Update header
        const dateEl = document.getElementById('today-date');
        if (dateEl) {
             dateEl.innerHTML = `<span style="font-weight:600; color:var(--text-main)">${greeting}</span> <span style="opacity:0.6; font-weight:400">| ${dateStr}</span>`;
        }

        // Quote / Warning Logic
        const quoteEl = document.getElementById('quote-container');
        if (quoteEl) {
            if (habits.length > 5) {
                 quoteEl.innerHTML = `<span style="color:#FF9F0A">⚡ Expert Tip:</span> Research suggests capping active habits at 5 prevents burnout. Chart limited to top 5.`;
            } else {
                 quoteEl.textContent = '"Habits are the compound interest of self-improvement."';
            }
        }

        // Filter habits relevant for today
        const doneCount = habits.filter(h => h.logs && h.logs[today]).length;
        const totalCount = habits.length;
        
        // Update header stats
        document.getElementById('today-progress').textContent = `${doneCount}/${totalCount}`;
        
        // Render horizontal scroll list
        const container = document.getElementById('today-habits');
        
        if (habits.length === 0) {
            container.innerHTML = `
                <div class="today-habit-pill empty" style="border: 2px dashed var(--border); background: transparent; color: var(--text-muted); justify-content: center; width: auto; padding: 0 20px;">
                    <span>Tap '+' to start your journey</span>
                </div>
            `;
            // Add click listener to the empty state to open create modal
            const emptyPill = container.querySelector('.today-habit-pill.empty');
            if (emptyPill) {
                emptyPill.addEventListener('click', () => {
                    this.vibrate();
                    this.openHabitModal();
                });
            }
            return;
        }

        container.innerHTML = habits.map(habit => {
            const isDone = habit.logs && habit.logs[today];
            const svgIcon = getIconSvg(habit.icon); // Use SVG helper
            return `
                <div class="today-habit-pill ${isDone ? 'done' : ''}" 
                     data-habit="${habit.id}"
                     data-date="${today}"
                     style="--habit-color: ${habit.color}">
                    <div class="today-habit-pill-icon">${svgIcon}</div>
                    <span class="today-habit-pill-name">${habit.name}</span>
                    <div class="today-habit-check">${isDone ? '✓' : ''}</div>
                </div>
            `;
        }).join('');
        
        // Bind click
        container.querySelectorAll('.today-habit-pill').forEach(pill => {
            pill.addEventListener('click', (e) => {
                this.vibrate();
                const habitId = pill.dataset.habit;
                const dateStr = pill.dataset.date;
                HabitStore.toggleDay(habitId, dateStr);
                this.render();
                this.checkCompletion();
            });
        });
    },

    
    habitsView: 'cards', // 'cards' or 'table'
    logView: 'chart', // 'chart' or 'calendar'
    

    

    
    openDayModal(dateStr) {
        const modal = document.getElementById('day-modal');
        const title = document.getElementById('day-modal-title');
        const body = document.getElementById('day-modal-body');
        const habits = HabitStore.getAll();
        
        const date = HabitStore.strToDate(dateStr);
        const formatted = date.toLocaleDateString('en-GB', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        });
        
        title.textContent = formatted;
        
        const doneCount = habits.filter(h => h.logs[dateStr]).length;
        
        body.innerHTML = `
            ${habits.map(habit => {
                const isDone = habit.logs[dateStr];
                return `
                    <div class="day-habit-item ${isDone ? 'done' : 'not-done'}" 
                         data-habit="${habit.id}" 
                         data-date="${dateStr}">
                        <span class="day-habit-icon">${habit.icon}</span>
                        <div class="day-habit-info">
                            <div class="day-habit-name">${habit.name}</div>
                            <div class="day-habit-status">${isDone ? '✓ Completed' : 'Not done'}</div>
                        </div>
                        <div class="day-habit-toggle">${isDone ? '✓' : ''}</div>
                    </div>
                `;
            }).join('')}
            <div class="day-summary">
                ${doneCount}/${habits.length} habits completed
            </div>
        `;
        
        // Bind toggle events
        body.querySelectorAll('.day-habit-item').forEach(item => {
            item.addEventListener('click', () => {
                this.vibrate();
                const habitId = item.dataset.habit;
                const date = item.dataset.date;
                HabitStore.toggleDay(habitId, date);
                this.render();
                this.openDayModal(date); // Refresh modal
                this.checkCompletion();
            });
        });
        
        modal.classList.add('active');
    },
    

    
    switchHabitsView(view) {
        this.habitsView = view;
        const cardsContainer = document.getElementById('habits-grid');
        const tableContainer = document.getElementById('habits-table');
        const tabs = document.querySelectorAll('#habits-tabs .tab');
        
        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.view === view);
        });
        
        if (view === 'cards') {
            cardsContainer.style.display = 'grid';
            tableContainer.style.display = 'none';
        } else {
            cardsContainer.style.display = 'none';
            tableContainer.style.display = 'block';
        }
    },
    
    switchLogView(view) {
        this.logView = view;
        const chartContainer = document.getElementById('chart-container');
        const calendarContainer = document.getElementById('calendar-container');
        const tabs = document.querySelectorAll('#log-tabs .log-tab');
        
        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.view === view);
        });
        
        if (view === 'chart') {
            chartContainer.style.display = 'block';
            calendarContainer.style.display = 'none';
            // Trigger render to animate chart
            this.renderChart();
        } else {
            chartContainer.style.display = 'none';
            calendarContainer.style.display = 'block';
        }
    },

    renderHabits() {
        const container = document.getElementById('habits-grid');
        const habits = HabitStore.getAll();
        const weekDates = HabitStore.getWeekDates();
        const today = HabitStore.getTodayStr();
        const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S']; // Week starts Monday
        
        container.innerHTML = habits.map(habit => {
            const streak = HabitStore.getStreak(habit);
            const weekComp = HabitStore.getWeekCompletion(habit);
            const isTodayDone = habit.logs[today];
            const svgIcon = getIconSvg(habit.icon); // Use SVG helper
            
            return `
                <div class="habit-card ${isTodayDone ? 'done' : ''}" data-id="${habit.id}" style="--habit-color: ${habit.color}">
                    <div class="habit-header">
                        <div class="habit-info">
                            <span class="habit-icon">${svgIcon}</span>
                            <div class="habit-details">
                                <span class="habit-name">${habit.name}</span>
                                <div class="habit-stats">
                                    <span class="fire">🔥 ${streak}</span>
                                    <span>•</span>
                                    <span>${weekComp.done}/${weekComp.total} this week</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <button class="habit-check-btn ${isTodayDone ? 'done' : ''}" 
                            data-habit="${habit.id}" 
                            data-date="${today}">
                        ${isTodayDone ? 'Done' : 'Mark Done'}
                    </button>
                    
                    <div class="habit-week">
                        ${weekDates.map((dateStr, index) => {
                            const isDone = habit.logs[dateStr];
                            const isToday = dateStr === today;
                            const dayLabel = dayLabels[index];
                            return `
                                <div class="habit-day-col" 
                                     data-habit="${habit.id}"
                                     data-date="${dateStr}">
                                    <span class="habit-day-label" style="${isToday ? 'color: var(--blue)' : ''}">${dayLabel}</span>
                                    <div class="habit-day-dot ${isDone ? 'done' : ''} ${isToday ? 'today' : ''}"
                                         style="${isDone ? `background: ${habit.color}; box-shadow: 0 0 8px ${habit.color}` : ''}"></div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }).join('');
    },

    renderCalendar() {
        const container = document.getElementById('calendar-container');
        const habits = HabitStore.getAll();
        const todayStr = HabitStore.getTodayStr();
        const today = HabitStore.strToDate(todayStr);
        
        // Show last 6 months
        const months = [];
        for (let i = 0; i < 6; i++) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            months.push(d);
        }
        
        const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
        
        container.innerHTML = months.map(monthDate => {
            const year = monthDate.getFullYear();
            const month = monthDate.getMonth();
            const monthName = monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            
            // First day of month (adjusted for Monday start)
            const firstDay = new Date(year, month, 1);
            const startDay = (firstDay.getDay() + 6) % 7; // Monday = 0
            
            // Days in month
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            
            // Build calendar days
            const days = [];
            
            // Empty cells before first day
            for (let i = 0; i < startDay; i++) {
                days.push('<div class="calendar-day empty"></div>');
            }
            
            // Days of month
            for (let day = 1; day <= daysInMonth; day++) {
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const logsCount = habits.filter(h => h.logs[dateStr]).length;
                const isToday = dateStr === todayStr;
                const hasLogs = logsCount > 0;
                const isHigh = logsCount >= habits.length * 0.75;
                
                days.push(`
                    <div class="calendar-day ${hasLogs ? 'has-logs' : ''} ${isHigh ? 'high' : ''} ${isToday ? 'today' : ''}" 
                         data-date="${dateStr}" 
                         title="${dateStr}: ${logsCount}/${habits.length}">
                        ${day}
                    </div>
                `);
            }
            
            return `
                <div class="calendar-month">
                    <div class="calendar-month-label">${monthName}</div>
                    <div class="calendar-grid">
                        ${dayLabels.map(l => `<div class="calendar-day-label">${l}</div>`).join('')}
                        ${days.join('')}
                    </div>
                </div>
            `;
        }).join('');
        
        // Add click delegation for days
        container.onclick = (e) => {
            const day = e.target.closest('.calendar-day');
            if (day && !day.classList.contains('empty')) {
                const dateStr = day.dataset.date;
                if (dateStr) {
                    this.openDayModal(dateStr);
                }
            }
        };
    },
    

    

    
    renderChart() {
        // Delegate to external renderer
        if (typeof ChartRenderer !== 'undefined') {
            const data = HabitStore.getTrendData(90);
            ChartRenderer.renderTrendChart('trend-chart', data);
        }
    },
    
    openHabitModal(habitId = null) {
        const modal = document.getElementById('habit-modal');
        const title = document.getElementById('modal-title');
        const form = document.getElementById('habit-form');
        const deleteBtn = document.getElementById('btn-delete-habit');
        
        form.reset();
        document.getElementById('habit-id').value = '';
        
        // 0. Get Used Colors (exclude current if editing)
        const allHabits = HabitStore.getAll();
        const usedColors = new Set(allHabits.filter(h => h.id !== habitId).map(h => h.color));
        
        // 1. Render Color Palette
        const paletteContainer = document.getElementById('color-palette');
        paletteContainer.innerHTML = HabitStore.PALETTE.map(color => {
            const isUsed = usedColors.has(color);
            const label = isUsed ? `Color ${color} (Already used)` : `Select color ${color}`;
            return `
                <div class="color-option ${isUsed ? 'used' : ''}" 
                     style="background-color: ${color}" 
                     data-color="${color}"
                     ${isUsed ? 'title="Color already in use"' : ''}
                     role="button"
                     tabindex="${isUsed ? '-1' : '0'}"
                     aria-label="${label}"
                     aria-disabled="${isUsed}">
                </div>
            `;
        }).join('');
        
        // 2. Render Icon Grid
        const iconGrid = document.getElementById('icon-grid');
        const iconKeys = Object.keys(ICONS).filter(k => k !== 'default');
        
        iconGrid.innerHTML = iconKeys.map(key => `
            <div class="icon-option" 
                 data-icon="${key}" 
                 title="${key}"
                 role="button"
                 tabindex="0"
                 aria-label="Select icon ${key}">
                ${ICONS[key]}
            </div>
        `).join('');

        // 3. Selection Logic
        let currentColor;
        let currentIcon = 'reading'; 
        
        if (habitId) {
            const habit = HabitStore.get(habitId);
            if (habit) {
                title.textContent = 'Edit habit';
                document.getElementById('habit-id').value = habit.id;
                document.getElementById('habit-name').value = habit.name;
                document.getElementById('habit-frequency').value = habit.frequency;
                document.getElementById('habit-goal').value = habit.goalPerWeek;
                
                currentColor = habit.color;
                currentIcon = habit.icon; // Could be emoji or key
                
                if (deleteBtn) deleteBtn.style.display = 'block';
            }
        } else {
            title.textContent = 'Create new habit';
            // Auto-select random unused neon color for new habits
            const unusedPalette = HabitStore.PALETTE.filter(c => !usedColors.has(c));
            if (unusedPalette.length > 0) {
                currentColor = unusedPalette[Math.floor(Math.random() * unusedPalette.length)];
            } else {
                // Fallback if all taken
                currentColor = HabitStore.getRandomColor();
            }
            
            if (deleteBtn) deleteBtn.style.display = 'none';
        }
        
        // Apply Selection
        this.selectColor(currentColor);
        this.selectIcon(currentIcon);
        
        // Helper for interaction
        const handleInteraction = (target) => {
             if (target.classList.contains('color-option')) {
                // Prevent selecting used colors
                if (target.classList.contains('used') && !target.classList.contains('current')) {
                    return;
                }
                this.vibrate();
                this.selectColor(target.dataset.color);
            } else {
                const iconOption = target.closest('.icon-option');
                if (iconOption) {
                    this.vibrate();
                    this.selectIcon(iconOption.dataset.icon);
                }
            }
        };

        // Bind Events (Click Delegation)
        const formContainer = document.querySelector('.modal-content'); // Or specific containers if preferred
        
        // Remove old listeners if any to avoid duplicates (though init creates fresh HTML)
        paletteContainer.onclick = (e) => handleInteraction(e.target);
        paletteContainer.onkeydown = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleInteraction(e.target);
            }
        };
        
        iconGrid.onclick = (e) => handleInteraction(e.target);
        iconGrid.onkeydown = (e) => {
             if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleInteraction(e.target);
            }
        };
        
        modal.classList.add('active');
    },
    
    selectColor(color) {
        document.getElementById('habit-color').value = color;
        document.querySelectorAll('.color-option').forEach(el => {
            el.classList.toggle('active', el.dataset.color === color);
        });
    },
    
    selectIcon(iconKey) {
        document.getElementById('habit-icon').value = iconKey;
        
        // Clear all active first
        document.querySelectorAll('.icon-option').forEach(el => el.classList.remove('active'));
        
        // Try to find exact match
        let option = document.querySelector(`.icon-option[data-icon="${iconKey}"]`);
        
        // If not found (e.g. legacy emoji), try to find mapped key? 
        if (!option) {
            // Check if we can map emoji to key
            const mappedKey = Object.keys(ICONS).find(k => k !== 'default' && (ICONS[k] === getIconSvg(iconKey) || k === iconKey.toLowerCase()));
            if (mappedKey) {
                 option = document.querySelector(`.icon-option[data-icon="${mappedKey}"]`);
                 if (option) document.getElementById('habit-icon').value = mappedKey; // Auto-update value to key
            }
        }
        
        if (option) {
            option.classList.add('active');
            // Scroll to view
            option.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    },
    
    saveHabit() {
        const id = document.getElementById('habit-id').value;
        const data = {
            name: document.getElementById('habit-name').value,
            icon: document.getElementById('habit-icon').value || '📌',
            frequency: document.getElementById('habit-frequency').value,
            goalPerWeek: parseInt(document.getElementById('habit-goal').value) || 7,
            color: document.getElementById('habit-color').value
        };
        
        if (id) {
            HabitStore.update(id, data);
        } else {
            HabitStore.create(data);
        }
        
        document.getElementById('habit-modal').classList.remove('active');
        this.render();
    },
    
    exportData() {
        // Mark backup as done
        localStorage.setItem('habit_last_backup', new Date().toISOString());
        document.getElementById('btn-settings').classList.remove('notification');

        const data = HabitStore.exportData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `habits-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    },
    
    importData(file) {
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            if (HabitStore.importData(e.target.result)) {
                this.render();
                document.getElementById('settings-modal').classList.remove('active');
                alert('Data imported successfully!');
            } else {
                alert('Failed to import data. Invalid format.');
            }
        };
        reader.readAsText(file);
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => App.init());
