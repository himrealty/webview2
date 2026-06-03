const express  = require('express');
const http     = require('http');
const path     = require('path');
const { WebSocketServer } = require('ws');

const mouse    = require('./automation/mouse');
const keyboard = require('./automation/keyboard');
const wins     = require('./automation/window');
const recorder = require('./automation/recorder');

const PORT = 3721;
const app  = express();

// Serve HTML UI
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());

const server = http.createServer(app);
const wss    = new WebSocketServer({ server });

// ── WebSocket command dispatcher ──────────────────────────────────────────────
wss.on('connection', (ws) => {
    console.log('[ws] client connected');

    ws.on('message', async (raw) => {
        let msg;
        try { msg = JSON.parse(raw); }
        catch { return ws.send(JSON.stringify({ error: 'invalid json' })); }

        const { id, action, payload } = msg;
        let result;

        try {
            switch (action) {
                // Mouse
                case 'mouse.move':    result = await mouse.move(payload);    break;
                case 'mouse.click':   result = await mouse.click(payload);   break;
                case 'mouse.scroll':  result = await mouse.scroll(payload);  break;
                case 'mouse.drag':    result = await mouse.drag(payload);    break;

                // Keyboard
                case 'keyboard.type':    result = await keyboard.type(payload);    break;
                case 'keyboard.hotkey':  result = await keyboard.hotkey(payload);  break;
                case 'keyboard.press':   result = await keyboard.press(payload);   break;

                // Windows
                case 'window.list':      result = await wins.list();               break;
                case 'window.focus':     result = await wins.focus(payload);       break;
                case 'window.close':     result = await wins.close(payload);       break;
                case 'window.resize':    result = await wins.resize(payload);      break;
                case 'window.move':      result = await wins.moveWin(payload);     break;

                // Recorder
                case 'recorder.start':   result = recorder.start();               break;
                case 'recorder.stop':    result = recorder.stop();                break;
                case 'recorder.play':    result = await recorder.play(payload);   break;
                case 'recorder.save':    result = recorder.save(payload);         break;
                case 'recorder.load':    result = recorder.load(payload);         break;
                case 'recorder.list':    result = recorder.listMacros();          break;

                default:
                    result = { error: `unknown action: ${action}` };
            }
        } catch (err) {
            result = { error: err.message };
        }

        ws.send(JSON.stringify({ id, result }));
    });

    ws.on('close', () => console.log('[ws] client disconnected'));
});

server.listen(PORT, '127.0.0.1', () => {
    console.log(`[server] running at http://127.0.0.1:${PORT}`);
});
