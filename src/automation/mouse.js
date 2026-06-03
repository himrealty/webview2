const { mouse, Point, Button } = require('@nut-tree-fork/nut-js');

mouse.config.mouseSpeed = 1000;

async function move({ x, y }) {
    await mouse.move([new Point(x, y)]);
    return { ok: true, x, y };
}

async function click({ x, y, button = 'left', double = false }) {
    const btn = button === 'right' ? Button.RIGHT : Button.LEFT;
    if (x !== undefined && y !== undefined) {
        await mouse.move([new Point(x, y)]);
    }
    if (double) {
        await mouse.doubleClick(btn);
    } else {
        await mouse.click(btn);
    }
    return { ok: true };
}

async function scroll({ x, y, direction = 'down', amount = 3 }) {
    if (x !== undefined && y !== undefined) {
        await mouse.move([new Point(x, y)]);
    }
    const { ScrollDirection } = require('@nut-tree-fork/nut-js');
    const dir = direction === 'up' ? ScrollDirection.UP : ScrollDirection.DOWN;
    await mouse.scroll(dir, amount);
    return { ok: true };
}

async function drag({ fromX, fromY, toX, toY }) {
    await mouse.move([new Point(fromX, fromY)]);
    await mouse.pressButton(Button.LEFT);
    await mouse.move([new Point(toX, toY)]);
    await mouse.releaseButton(Button.LEFT);
    return { ok: true };
}

module.exports = { move, click, scroll, drag };
