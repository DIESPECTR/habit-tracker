const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.BOT_TOKEN || '8369060666:AAGf5m_6Dae_2FoD06f8wW2mxZgUo7hqSEI'; // User must set this!

app.use(bodyParser.json());
app.use(express.static('public'));

// Data Directory
const DATA_DIR = path.join(__dirname, 'data');

// Ensure Data Directory Exists
(async () => {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
    } catch (e) {
        console.error('Failed to create data dir:', e);
    }
})();

// --- Middleware: Verify Telegram Auth ---
const verifyTelegramAuth = (req, res, next) => {
    const initData = req.headers['authorization'];
    if (!initData) {
        return res.status(401).json({ error: 'No authorization header' });
    }

    // Parse initData
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    const dataToCheck = [];
    
    params.sort();
    params.forEach((val, key) => {
        if (key !== 'hash') {
            dataToCheck.push(`${key}=${val}`);
        }
    });

    const dataCheckString = dataToCheck.join('\n');
    
    // Validate
    const secret = crypto.createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest();
    const calculatedHash = crypto.createHmac('sha256', secret).update(dataCheckString).digest('hex');

    if (calculatedHash === hash) {
        // Valid!
        // Extract user ID
        const userStr = params.get('user');
        if (userStr) {
            req.telegramUser = JSON.parse(userStr);
            next();
        } else {
            res.status(400).json({ error: 'No user data found' });
        }
    } else {
        // For development/demo without real bot token, we might want a bypass or strict mode
        // For now, fail if token doesn't match
        console.log('Auth failed:', calculatedHash, '!==', hash);
        res.status(403).json({ error: 'Invalid authentication' });
    }
};

// --- Routes ---

// Sync: Save data
app.post('/api/sync', verifyTelegramAuth, async (req, res) => {
    try {
        const userId = req.telegramUser.id;
        const habits = req.body.habits;
        
        if (!habits) return res.status(400).json({ error: 'No data provided' });

        const filePath = path.join(DATA_DIR, `${userId}.json`);
        await fs.writeFile(filePath, JSON.stringify({
            updatedAt: new Date().toISOString(),
            habits: habits
        }));

        res.json({ success: true });
    } catch (e) {
        console.error('Sync error:', e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get: Retrieve data
app.get('/api/data', verifyTelegramAuth, async (req, res) => {
    try {
        const userId = req.telegramUser.id;
        const filePath = path.join(DATA_DIR, `${userId}.json`);
        
        try {
            const data = await fs.readFile(filePath, 'utf8');
            res.json(JSON.parse(data));
        } catch (err) {
            if (err.code === 'ENOENT') {
                res.json({ habits: [] }); // New user
            } else {
                throw err;
            }
        }
    } catch (e) {
        console.error('Get error:', e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
