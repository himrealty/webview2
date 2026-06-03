const { keyboard, Key } = require('@nut-tree-fork/nut-js');

keyboard.config.autoDelayMs = 30;

// Map string key names to nut-js Key enum
function resolveKey(k) {
    const upper = k.toUpperCase().replace(/[^A-Z0-9_]/g, '_');
    if (Key[upper] !== undefined) return Key[upper];
    // Common aliases
    const aliases = {
        'CTRL': Key.LeftControl, 'CONTROL': Key.LeftControl,
        'ALT':  Key.LeftAlt,    'SHIFT': Key.LeftShift,
        'WIN':  Key.LeftSuper,  'META': Key.LeftSuper,
        'ENTER': Key.Return,    'RETURN': Key.Return,
        'ESC':   Key.Escape,    'DEL': Key.Delete,
        'BACKSPACE': Key.Backspace, 'TAB': Key.Tab,
        'SPACE': Key.Space,     'UP': Key.Up, 'DOWN': Key.Down,
        'LEFT': Key.Left,       'RIGHT': Key.Right,
        'HOME': Key.Home,       'END': Key.End,
        'PAGEUP': Key.PageUp,   'PAGEDOWN': Key.PageDown,
        'F1':Key.F1,'F2':Key.F2,'F3':Key.F3,'F4':Key.F4,
        'F5':Key.F5,'F6':Key.F6,'F7':Key.F7,'F8':Key.F8,
        'F9':Key.F9,'F10':Key.F10,'F11':Key.F11,'F12':Key.F12,
    };
    const alias = aliases[k.toUpperCase()];
    if (alias !== undefined) return alias;
    throw new Error(`Unknown key: "${k}"`);
}

async function type({ text, delayMs }) {
    if (delayMs) keyboard.config.autoDelayMs = delayMs;
    await keyboard.type(text);
    return { ok: true };
}

async function hotkey({ keys }) {
    // keys: array of strings e.g. ["ctrl","c"] or ["alt","f4"]
    const resolved = keys.map(resolveKey);
    await keyboard.pressKey(...resolved);
    await keyboard.releaseKey(...resolved);
    return { ok: true };
}

async function press({ key }) {
    const k = resolveKey(key);
    await keyboard.pressKey(k);
    await keyboard.releaseKey(k);
    return { ok: true };
}

module.exports = { type, hotkey, press };
