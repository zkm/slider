// Accessible, responsive vanilla JS carousel with enhanced touch support
document.addEventListener('DOMContentLoaded', function () {
	const slides = Array.from(document.querySelectorAll('#slideshow li'));
	const thumbnailItems = Array.from(document.querySelectorAll('#slide-pager ul li'));
	const thumbnails = Array.from(document.querySelectorAll('#slide-pager ul li a'));
	const prevBtn = document.getElementById('prev');
	const nextBtn = document.getElementById('next');
	const slideshow = document.getElementById('slideshow');
	const pagerList = document.querySelector('#slide-pager ul');
	
	// Configuration for visible thumbnails
	const config = {
		smallScreenMax: 3,  // Max thumbnails on small screens
		mediumScreenMax: 5, // Max thumbnails on medium screens
		largeScreenMax: 9,  // Max thumbnails on large screens
	};
	
	let current = 0;
	
	// Touch variables
	let touchStartX = 0;
	let touchEndX = 0;
	let touchStartY = 0;
	let touchEndY = 0;
	
	// Function to update thumbnail visibility based on screen size and current slide
	function updateThumbnailVisibility() {
		// Remove any existing indicators
		const existingIndicators = pagerList.querySelectorAll('.thumb-indicator');
		existingIndicators.forEach(indicator => indicator.remove());
		
		// Reset visibility classes
		thumbnailItems.forEach(item => {
			item.classList.remove('thumb-always-visible', 'thumb-medium-visible', 'thumb-large-visible');
			item.style.display = 'none'; // Hide all thumbnails first
		});
		
		// Get screen width
		const screenWidth = window.innerWidth;
		const totalThumbs = thumbnailItems.length;
		
		// Determine max visible thumbnails based on screen size
		let maxVisible = config.largeScreenMax; // Default to large
		
		if (screenWidth <= 400) {
			maxVisible = config.smallScreenMax; // 3 on small screens
		} else if (screenWidth <= 599) {
			maxVisible = config.mediumScreenMax; // 5 on medium screens
		}
		
		// Ensure max visible is an odd number for balanced display
		if (maxVisible % 2 === 0) maxVisible--;
		
		// Calculate which thumbnails to show
		const halfVisible = Math.floor(maxVisible / 2);
		let startIdx = Math.max(0, current - halfVisible);
		let endIdx = Math.min(totalThumbs - 1, startIdx + maxVisible - 1);
		
		// Adjust if we're near the end
		if (endIdx >= totalThumbs - 1) {
			startIdx = Math.max(0, totalThumbs - maxVisible);
			endIdx = totalThumbs - 1;
		}
		
		// Show the calculated range of thumbnails
		for (let i = startIdx; i <= endIdx; i++) {
			if (thumbnailItems[i]) {
				thumbnailItems[i].style.display = '';
				thumbnailItems[i].classList.add(i === current ? 'thumb-always-visible' : 'thumb-medium-visible');
			}
		}
		
		// Add left indicator if needed
		if (startIdx > 0) {
			const leftIndicator = document.createElement('li');
			leftIndicator.className = 'thumb-indicator left-indicator';
			leftIndicator.setAttribute('aria-hidden', 'true');
			pagerList.insertBefore(leftIndicator, pagerList.firstChild);
		}
		
		// Add right indicator if needed
		if (endIdx < totalThumbs - 1) {
			const rightIndicator = document.createElement('li');
			rightIndicator.className = 'thumb-indicator right-indicator';
			rightIndicator.setAttribute('aria-hidden', 'true');
			pagerList.appendChild(rightIndicator);
		}
	}
	
	function showSlide(idx, direction = null) {
		// Ensure idx is within bounds
		if (idx < 0) idx = 0;
		if (idx >= slides.length) idx = slides.length - 1;
		
		// Prepare animation direction
		const outgoingSlide = slides[current];
		const incomingSlide = slides[idx];
		
		// Set transition direction based on swipe or button press
		direction = direction || (idx > current ? 'next' : 'prev');
		
		// Remove previous transition classes
		slides.forEach(slide => {
			slide.classList.remove('slide-incoming-next', 'slide-outgoing-next', 'slide-incoming-prev', 'slide-outgoing-prev');
			slide.setAttribute('aria-selected', 'false');
			slide.style.zIndex = 1;
		});
		
		// Set new transition classes
		if (outgoingSlide) {
			outgoingSlide.classList.add(`slide-outgoing-${direction}`);
		}
		incomingSlide.classList.add(`slide-incoming-${direction}`);
		incomingSlide.setAttribute('aria-selected', 'true');
		incomingSlide.style.zIndex = 2;
		
		// Try to trigger haptic feedback if supported
		if (window.navigator.vibrate && direction) {
			window.navigator.vibrate(10);
		}
		
		thumbnails.forEach((thumb, i) => {
			thumb.parentElement.classList.toggle('activeSlide', i === idx);
		});
		current = idx;
		
		// Update thumbnail visibility based on new current slide
		updateThumbnailVisibility();
		
		// Ensure active thumbnail is in view
		if (thumbnailItems[current]) {
			thumbnailItems[current].scrollIntoView({
				behavior: 'smooth',
				block: 'nearest',
				inline: 'center'
			});
		}
		
		// Announce slide change for screen readers
		const liveRegion = document.getElementById('carousel-live-region');
		if (liveRegion) {
			liveRegion.textContent = `Showing slide ${current + 1} of ${slides.length}`;
		}
	}
	
	// First/last button states management has been removed

	// next/prev will be defined later with optional direction param

	nextBtn.addEventListener('click', function (e) {
		e.preventDefault();
		nextSlide();
	});
	prevBtn.addEventListener('click', function (e) {
		e.preventDefault();
		prevSlide();
	});

	// First and last slide navigation has been removed

	thumbnails.forEach((thumb, idx) => {
		thumb.addEventListener('click', function (e) {
			e.preventDefault();
			showSlide(idx);
		});
	});

	// Keyboard navigation for controls and wrapper
	function handleKey(e) {
		if (e.key === 'ArrowRight') {
			nextSlide();
		} else if (e.key === 'ArrowLeft') {
			prevSlide();
		}
	}
	document.getElementById('slideshow-wrapper').addEventListener('keydown', handleKey);
	if (prevBtn) prevBtn.addEventListener('keydown', handleKey);
	if (nextBtn) nextBtn.addEventListener('keydown', handleKey);

	// Removed pagerNext-related code
	function updatePagerButtons() {
		// No longer needed since pagerNext is removed
	}
	
	// Handle window resizing for thumbnail visibility
	window.addEventListener('resize', function() {
		updateThumbnailVisibility();
	});
	
	// Initialize pager button state
	updatePagerButtons();
	
	// Add scroll amount tracking to make buttons more useful
	let scrollAmount = 200; // Default scroll amount
	
	// Dynamically adjust scroll amount based on thumbnail size
	function updateScrollAmount() {
		if (thumbnailItems.length > 0) {
			// Use the actual thumbnail width + margin
			const thumbWidth = thumbnailItems[0].offsetWidth;
			const gap = 12; // Gap between thumbnails
			scrollAmount = thumbWidth + gap;
			console.log('Updated scrollAmount:', scrollAmount); // Log scroll amount
		}
	}
	
	// Update scroll amount when window resizes
	window.addEventListener('resize', () => {
		console.log('Window resized');
		updateScrollAmount();
	});
	
	// Improve scroll button interactions
	nextBtn.addEventListener('click', function() {
		updateScrollAmount();
		console.log('Next clicked');
		console.log('Scroll position before Next:', pagerList.scrollLeft); // Log scroll position before
		pagerList.scrollBy({ 
			left: scrollAmount * 2, // Scroll 2 thumbnails at a time
			behavior: 'smooth' 
		});
		console.log('Scroll position after Next:', pagerList.scrollLeft); // Log scroll position after
		// Add visual feedback
		this.classList.add('button-clicked');
		setTimeout(() => this.classList.remove('button-clicked'), 200);
	});
	
	prevBtn.addEventListener('click', function() {
		updateScrollAmount();
		console.log('Prev clicked');
		console.log('Scroll position before Prev:', pagerList.scrollLeft); // Log scroll position before
		pagerList.scrollBy({ 
			left: -scrollAmount * 2, // Scroll 2 thumbnails at a time
			behavior: 'smooth' 
		});
		console.log('Scroll position after Prev:', pagerList.scrollLeft); // Log scroll position after
		// Add visual feedback
		this.classList.add('button-clicked');
		setTimeout(() => this.classList.remove('button-clicked'), 200);
	});
	
	// Initial scroll amount calculation
	updateScrollAmount();

	// Touch gesture handling for swipes
	function handleTouchStart(e) {
		touchStartX = e.changedTouches[0].screenX;
		touchStartY = e.changedTouches[0].screenY;
	}
	
	function handleTouchEnd(e) {
		touchEndX = e.changedTouches[0].screenX;
		touchEndY = e.changedTouches[0].screenY;
		handleSwipe();
	}
	
	function handleSwipe() {
		const minSwipeDistance = 50; // Minimum swipe distance in pixels
		const maxVerticalOffset = 100; // Maximum vertical movement allowed for horizontal swipe
		
		const horizontalDist = touchEndX - touchStartX;
		const verticalDist = Math.abs(touchEndY - touchStartY);
		
		// Only register as a horizontal swipe if vertical movement is limited
		if (verticalDist < maxVerticalOffset) {
			if (horizontalDist > minSwipeDistance) {
				// Right swipe
				prevSlide('prev');
				// Add ripple effect to previous button
				addRippleEffect(prevBtn);
			} else if (horizontalDist < -minSwipeDistance) {
				// Left swipe
				nextSlide('next');
				// Add ripple effect to next button
				addRippleEffect(nextBtn);
			}
		}
	}
	
	// Add ripple effect to indicate touch
	function addRippleEffect(element) {
		const ripple = document.createElement('span');
		ripple.classList.add('touch-ripple');
		element.appendChild(ripple);
		
		// Remove ripple after animation completes
		setTimeout(() => {
			ripple.remove();
		}, 600);
	}
	
	// Touch feedback on swipe
	function handleTouchMove(e) {
		touchEndX = e.changedTouches[0].screenX;
		const pullDistance = touchEndX - touchStartX;
		
		// If pulling from left edge or right edge, show pull indicator
		if ((current === 0 && pullDistance > 50) || 
			(current === slides.length - 1 && pullDistance < -50)) {
			document.body.classList.add('is-pulling');
			const indicator = document.querySelector('.pull-indicator');
			if (indicator) {
				const scale = Math.min(Math.abs(pullDistance) / 200, 1);
				indicator.style.transform = `scaleX(${scale})`;
			}
		}
	}
	
	function handleTouchCancel() {
		// Reset pull indicator
		document.body.classList.remove('is-pulling');
		const indicator = document.querySelector('.pull-indicator');
		if (indicator) {
			indicator.style.transform = 'scaleX(0)';
		}
	}
	
	// Initialize touch events
	slideshow.addEventListener('touchstart', handleTouchStart, { passive: true });
	slideshow.addEventListener('touchmove', handleTouchMove, { passive: true });
	slideshow.addEventListener('touchend', handleTouchEnd);
	slideshow.addEventListener('touchcancel', handleTouchCancel);
	
	// Update next and prev functions to accept direction parameter
	function nextSlide(direction = 'next') {
		showSlide((current + 1) % slides.length, direction);
	}
	
	function prevSlide(direction = 'prev') {
		showSlide((current - 1 + slides.length) % slides.length, direction);
	}
	
	// Add live region for screen reader users
	const liveRegion = document.createElement('div');
	liveRegion.id = 'carousel-live-region';
	liveRegion.setAttribute('aria-live', 'polite');
	liveRegion.setAttribute('aria-atomic', 'true');
	liveRegion.className = 'sr-only';
	document.getElementById('slideshow-wrapper').appendChild(liveRegion);

	// Initialize
	showSlide(0);
	
	// Initial thumbnail visibility setup
	updateThumbnailVisibility();

	thumbnailItems.forEach((item, index) => {
		console.log(`Thumbnail ${index} width:`, item.offsetWidth);
	});

	const totalThumbnailWidth = thumbnailItems.reduce((acc, item) => acc + item.offsetWidth, 0);
	console.log('Total Thumbnail Width:', totalThumbnailWidth);
});
