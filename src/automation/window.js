const { windowManager } = require('node-window-manager');

async function list() {
    const windows = windowManager.getWindows();
    return windows
        .filter(w => w.getTitle && w.getTitle().trim().length > 0)
        .map(w => ({
            id:     w.id,
            title:  w.getTitle(),
            bounds: w.getBounds(),
        }));
}

async function focus({ id, title }) {
    const win = findWindow(id, title);
    win.bringToTop();
    win.restore();
    return { ok: true, title: win.getTitle() };
}

async function close({ id, title }) {
    const win = findWindow(id, title);
    win.close();
    return { ok: true };
}

async function resize({ id, title, width, height }) {
    const win = findWindow(id, title);
    const bounds = win.getBounds();
    win.setBounds({ x: bounds.x, y: bounds.y, width, height });
    return { ok: true };
}

async function moveWin({ id, title, x, y }) {
    const win = findWindow(id, title);
    const bounds = win.getBounds();
    win.setBounds({ x, y, width: bounds.width, height: bounds.height });
    return { ok: true };
}

function findWindow(id, title) {
    const windows = windowManager.getWindows();
    let win;
    if (id !== undefined) {
        win = windows.find(w => w.id === id);
    } else if (title) {
        win = windows.find(w => w.getTitle().toLowerCase().includes(title.toLowerCase()));
    }
    if (!win) throw new Error(`Window not found: id=${id} title=${title}`);
    return win;
}

module.exports = { list, focus, close, resize, moveWin };
