document.addEventListener('DOMContentLoaded', () => {
    if (typeof PALERMO_CAKE_DATA === 'undefined') {
        console.warn('PALERMO_CAKE_DATA is not defined. The cake layer info popup will not work.');
    }

    const hasData = typeof PALERMO_CAKE_DATA !== 'undefined';
    const targetElement = document.body;

    const LAYER_PERCENTAGES = {
        vertical:   { 1: 0.93,  2: 0.78,  3: 0.61,  4: 0.44,  5: 0.27  },
        horizontal: { 1: 0.93,  2: 0.78,  3: 0.61,  4: 0.44,  5: 0.27  }
    };

    function getCakeImage() {
        const mainCakeWidget = document.getElementById('main-cake');
        if (mainCakeWidget) {
            const img = mainCakeWidget.querySelector('img');
            if (img) return img;
        }
        const container = document.getElementById('cake-parts');
        if (!container) return null;
        const imgs = container.querySelectorAll('img');
        for (const img of imgs) {
            if (!img.closest('[id^="glow-"]') && !img.closest('.glow')) return img;
        }
        return null;
    }

    function positionButtons() {
        const cake = getCakeImage();
        if (!cake) return;
        const rect = cake.getBoundingClientRect();
        if (rect.height === 0) return;
        const isHorizontal = targetElement.classList.contains('horizontal');
        const table = isHorizontal ? LAYER_PERCENTAGES.horizontal : LAYER_PERCENTAGES.vertical;
        for (let i = 1; i <= 5; i++) {
            const btn = document.getElementById(`button-${i}`);
            if (!btn) continue;
            const btnRect = btn.getBoundingClientRect();
            const layerY = rect.top + rect.height * table[i];
            const isVertical = !isHorizontal;
            const topValue = isVertical ? layerY + btnRect.height / 2 : layerY - btnRect.height / 2;
            btn.style.top = `${topValue}px`;
            btn.style.left = `${rect.left + rect.width / 2}px`;
            btn.style.bottom = 'auto';
        }
    }

    function updateOrientation() {
        const isHorizontal = window.innerWidth >= window.innerHeight;
        targetElement.classList.toggle('horizontal', isHorizontal);
        targetElement.classList.toggle('vertical', !isHorizontal);
        positionButtons();
    }
    updateOrientation();

    let resizeRafId = null;
    window.addEventListener('resize', () => {
        if (resizeRafId !== null) return;
        resizeRafId = requestAnimationFrame(() => {
            resizeRafId = null;
            updateOrientation();
        });
    });

    window.addEventListener('load', positionButtons);

    const cakeImage = getCakeImage();
    if (cakeImage && typeof ResizeObserver !== 'undefined') {
        new ResizeObserver(positionButtons).observe(cakeImage);
    }

    let activeLayerId = null;
    let isTransitioning = false;
    const TRANSITION_MS = 300;

    for (let i = 1; i <= 5; i++) {
        const button = document.createElement('div');
        button.id = `button-${i}`;
        button.classList.add('cake-button');

        const data = hasData ? PALERMO_CAKE_DATA.find(d => d.id === i) : null;
        const glowElement = document.getElementById(`glow-${i}`);

        if (data) {
            const labelEl = document.createElement('span');
            labelEl.className = 'palermo-btn-label';
            labelEl.textContent = data.shortName;
            button.appendChild(labelEl);
        }

        const toggleGlow = (e) => {
            if (glowElement) {
                glowElement.classList.toggle('visible', e.type === 'mouseenter');
            }
        };
        button.addEventListener('mouseenter', toggleGlow);
        button.addEventListener('mouseleave', toggleGlow);

        button.addEventListener('click', () => {
            if (isTransitioning || !hasData) return;
            if (activeLayerId === i) return;

            if (activeLayerId !== null) {
                isTransitioning = true;
                dismissPopup();

                setTimeout(() => {
                    openPopup(i);
                    button.classList.add('is-active');
                    activeLayerId = i;
                    isTransitioning = false;
                }, TRANSITION_MS);
            } else {
                openPopup(i);
                button.classList.add('is-active');
                activeLayerId = i;
            }
        });

        document.body.appendChild(button);
    }

    positionButtons();

    let popup = null;
    if (hasData) {
        popup = document.createElement('div');
        popup.className = 'palermo-popup';
        document.body.appendChild(popup);
    }

    document.addEventListener('click', (e) => {
        if (!popup || !activeLayerId) return;
        if (e.target.closest('.palermo-popup, .cake-button')) return;
        dismissPopup();
    });

    function openPopup(layerId) {
        if (!popup) return;
        const data = PALERMO_CAKE_DATA.find(d => d.id === layerId);
        if (!data) return;

        popup.innerHTML = '';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'palermo-popup-close';
        closeBtn.type = 'button';
        closeBtn.setAttribute('aria-label', 'Close');
        closeBtn.textContent = '\u00d7';
        closeBtn.addEventListener('click', () => dismissPopup());
        popup.appendChild(closeBtn);

        const icon = document.createElement('div');
        icon.className = 'palermo-popup-icon';
        icon.textContent = data.icon;
        popup.appendChild(icon);

        const title = document.createElement('div');
        title.className = 'palermo-popup-title';
        title.textContent = data.fullName;
        popup.appendChild(title);

        const desc = document.createElement('div');
        desc.className = 'palermo-popup-desc';
        desc.textContent = data.description;
        popup.appendChild(desc);

        const link = document.createElement('a');
        link.className = 'palermo-popup-btn';
        link.href = data.url;
        link.textContent = 'Explore';
        const targetBlank = data.targetBlank !== false;
        if (targetBlank) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
        popup.appendChild(link);

        const isHorizontal = targetElement.classList.contains('horizontal');
        popup.classList.toggle('horizontal', isHorizontal);
        popup.classList.toggle('vertical', !isHorizontal);

        if (isHorizontal) {
            const btn = document.getElementById(`button-${layerId}`);
            if (btn) {
                const rect = btn.getBoundingClientRect();
                const buttonCenterY = rect.top + rect.height / 2;
                popup.style.top = `${buttonCenterY}px`;
            }
        } else {
            popup.style.top = '';
        }

        popup.classList.add('open');
    }

    function dismissPopup() {
        if (!popup || activeLayerId === null) return;
        popup.classList.remove('open');
        const btn = document.getElementById('button-' + activeLayerId);
        if (btn) btn.classList.remove('is-active');
        activeLayerId = null;
    }
});
