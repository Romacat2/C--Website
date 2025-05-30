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
