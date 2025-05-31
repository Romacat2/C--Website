window.setupRatScroll = function (dotNetRef) {
    if (window.__ratScrollSetup) return; // не ставити двічі!
    window.__ratScrollSetup = true;

    let currentEffectTime = 0;
    let lastY = null;

    function inRatZone() {
        const el = document.getElementById("rat-zone");
        if (!el) return false;
        const rect = el.getBoundingClientRect();

        // Визначити висоту вікна
        const vh = window.innerHeight || document.documentElement.clientHeight;

        // Якщо бодай 20px зони у вікні — вважаємо, що вона активна
        const visibleHeight = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
        return visibleHeight > 20;
    }


    async function applyDelta(delta, e) {
        const shouldAnimate =
            (delta > 0 && currentEffectTime < 100) ||
            (delta < 0 && currentEffectTime > 0);
        if (!shouldAnimate) return;
        e?.preventDefault?.();
        currentEffectTime = await dotNetRef.invokeMethodAsync("OnWheelInput", delta);
    }

    // Колесо
    const onWheel = async (e) => {
        if (!inRatZone()) return;
        const delta = Math.sign(e.deltaY);
        await applyDelta(delta, e);
    };

    // Клавіші
    const onKey = async (e) => {
        if (!inRatZone()) return;
        let delta = 0;
        if (["ArrowDown", "PageDown", " "].includes(e.key)) delta = 1;
        else if (["ArrowUp", "PageUp"].includes(e.key)) delta = -1;
        if (delta !== 0) await applyDelta(delta, e);
    };

    // Touch
    const onTouchStart = (e) => {
        if (inRatZone() && e.touches.length === 1) lastY = e.touches[0].clientY;
    };

    const onTouchMove = async (e) => {
        if (!inRatZone() || e.touches.length !== 1 || lastY === null) return;
        const currentY = e.touches[0].clientY;
        const delta = Math.sign(lastY - currentY);
        if (delta !== 0) {
            await applyDelta(delta, e);
            lastY = currentY;
        }
    };

    const onTouchEnd = () => { lastY = null; };

    // Додаємо слухачі один раз
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
};
window.snakeInterop = {
    adjustCanvasSize: function (canvasId, blockSize) {
        const canvas = document.getElementById(canvasId);

        let width, height;

        if (window.innerHeight < window.innerWidth) {
            height = Math.floor(window.innerHeight * 0.85);
            width = height;
        } else {
            width = window.innerWidth;
            height = width;
        }

        width = Math.floor(width / blockSize-2) * blockSize;
        height = Math.floor(height / blockSize-2) * blockSize;

        canvas.width = width;
        canvas.height = height;

        return { width: width, height: height };
    },
    drawSquare: function (ctx, x, y, size, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, size, size);
    },
    drawCircle: function (ctx, x, y, radius, color) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = color;
        ctx.fill();
    },
    drawText: function (ctx, text, x, y, font, color, align = "center", baseline = "middle") {
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.textAlign = align;
        ctx.textBaseline = baseline;
        ctx.fillText(text, x, y);
    },
    drawBorder: function (ctx, blockSize, width, height, color) {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, width, blockSize); // top
        ctx.fillRect(0, height - blockSize, width, blockSize); // bottom
        ctx.fillRect(0, 0, blockSize, height); // left
        ctx.fillRect(width - blockSize, 0, blockSize, height); // right
    }
};

