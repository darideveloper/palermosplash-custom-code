document.addEventListener('DOMContentLoaded', () => {
    const targetElement = document.querySelector('body'); 
    if (!targetElement) return;

    // 1. Handle Orientation
    function updateOrientation() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const isHorizontal = width >= height;

        targetElement.classList.toggle('horizontal', isHorizontal);
        targetElement.classList.toggle('vertical', !isHorizontal);
    }

    updateOrientation();
    window.addEventListener('resize', updateOrientation);

    // 2. Duplicate "text" elements
    document.querySelectorAll('.text').forEach(textEl => {
        const clone = textEl.cloneNode(true);
        if (textEl.id) {
            clone.id = `${textEl.id}-over`;
        }
        clone.classList.add('over');
        textEl.parentNode.insertBefore(clone, textEl.nextSibling);
    });
	
	// 3. Generate Buttons & Handle Hovers
	for (let i = 1; i <= 5; i++) {
		const div = document.createElement('div');
		div.id = `button-${i}`;
		div.classList.add("cake-button");

		const glowElement = document.querySelector(`#glow-${i}`);
        const overTextElement = document.querySelector(`#text-${i}-over`);

        // Reusable toggle function for hover states
        const toggleVisibility = (e) => {
            const isVisible = e.type === 'mouseenter';
            [glowElement, overTextElement].forEach(el => {
                if (el) el.classList.toggle('visible', isVisible);
            });
        };

		div.addEventListener('mouseenter', toggleVisibility);
		div.addEventListener('mouseleave', toggleVisibility);

		document.body.appendChild(div);
	}
});
