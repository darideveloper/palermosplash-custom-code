document.addEventListener('DOMContentLoaded', () => {
    // 1. Select your target element
    const targetElement = document.querySelector('body'); 
    
    if (!targetElement) return;

    function updateOrientation() {
        // Option A: Based on the browser viewport size
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Option B: Un-comment below if you want it based on a specific parent container's size instead
        // const width = targetElement.parentElement.clientWidth;
        // const height = targetElement.parentElement.clientHeight;

        if (width >= height) {
            targetElement.classList.add('horizontal');
            targetElement.classList.remove('vertical');
        } else {
            targetElement.classList.add('vertical');
            targetElement.classList.remove('horizontal');
        }
    }

    // 2. Run on initial page load
    updateOrientation();

    // 3. Run whenever the screen resizes
    window.addEventListener('resize', updateOrientation);
	
	// Loop 5 times to generate button-1 through button-5
	for (let i = 1; i <= 5; i++) {
		// 1. Create the div element
		const div = document.createElement('div');

		// 2. Assign the ID (e.g., button-1, button-2)
		div.id = `button-${i}`;
		div.classList.add("cake-button")

		// 3. Find the corresponding glow element (#glow-1, #glow-2, etc.)
		const glowElement = document.querySelector(`#glow-${i}`);

		// 4. Add hover detection (mouseenter / mouseleave)
		div.addEventListener('mouseenter', () => {
			if (glowElement) {
				glowElement.classList.add('visible');
			}
		});

		div.addEventListener('mouseleave', () => {
			if (glowElement) {
				glowElement.classList.remove('visible');
			}
		});

		// 5. Append the newly created div to the body (or any container)
		document.body.appendChild(div);
	}
});
