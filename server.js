const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const BOT_TOKEN = process.env.BOT_TOKEN || '8721286574:AAErN0ZEPj6olvQ-BQ9LpoTrfN0eSLkDwX4';
const CHAT_ID = process.env.CHAT_ID || '6258528476';

app.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
});

app.post('/telegram-alert', async (req, res) => {
    try {
        const { message } = req.body;
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message || '🔔 Nouvelle activité sur le site',
                parse_mode: 'Markdown'
            })
        });
        res.json({ success: true });
    } catch (err) {
        console.error('telegram-alert error:', err);
        res.status(500).json({ success: false });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Airtel Prêt RDC server running on port ${PORT}`);
});