// Initialize AOS
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS with custom settings
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: true,
        mirror: false,
        offset: 50
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Hamburger menu animation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Navbar scroll effect
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            navbar.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
            navbar.classList.remove('scroll-up');
            navbar.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
            navbar.classList.remove('scroll-down');
            navbar.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });

    // Video Showcase Handler with optimizations
    const videoItems = document.querySelectorAll('.video-item');
    const observerOptions = {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    };

    const videoObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target.querySelector('video');
                if (video) {
                    video.play().catch(() => {});
                    entry.target.classList.add('loaded');
                    observer.unobserve(entry.target);
                }
            }
        });
    }, observerOptions);

    videoItems.forEach(item => {
        videoObserver.observe(item);
    });

    // Optimize video loading
    const videos = document.querySelectorAll('video');
    
    videos.forEach((video, index) => {
        // Set animation delay
        video.parentElement.style.setProperty('--delay', index * 0.2);
        
        // Optimize video playback
        video.setAttribute('playsinline', '');
        video.setAttribute('muted', '');
        video.setAttribute('loop', '');
        
        // Start playing when in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.play().catch(() => {});
                    observer.unobserve(video);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        observer.observe(video);
    });

    // Optimize hero background video
    const heroVideo = document.querySelector('.hero-background');
    if (heroVideo) {
        heroVideo.play().catch(() => {});
    }

    // Initialize package card animations
    const packageCards = document.querySelectorAll('.package-card');
    packageCards.forEach((card, index) => {
        card.style.setProperty('--card-index', index);
    });

    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });

    // Add intersection observer for package cards
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    packageCards.forEach(card => {
        observer.observe(card);
    });

    // Handle video loading and animations
    const videoItemsVideos = document.querySelectorAll('.video-item video');
    
    videoItemsVideos.forEach(video => {
        // Add loading class
        video.parentElement.classList.add('loading');
        
        // Handle successful video load
        video.addEventListener('loadeddata', () => {
            if (video.readyState >= 3) {
                video.parentElement.classList.remove('loading');
                video.parentElement.classList.add('loaded');
                video.style.opacity = '1';
            }
        });

        // Handle video play
        video.addEventListener('play', () => {
            video.parentElement.classList.add('playing');
        });

        // Handle video errors
        video.addEventListener('error', () => {
            video.parentElement.classList.remove('loading');
            video.parentElement.classList.add('error');
            console.error('Video failed to load:', video.src);
            
            // Retry loading with MP4 format if not already
            if (!video.src.toLowerCase().endsWith('.mp4')) {
                const mp4Source = video.src.replace(/\.[^/.]+$/, '.mp4');
                video.src = mp4Source;
            }
        });

        // Force load check after timeout
        setTimeout(() => {
            if (video.readyState < 3) {
                video.load();
            }
        }, 3000);
    });
});

// EmailJS initialization
emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your EmailJS public key

// Booking Form Handler
document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Show loading state
    const submitButton = this.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitButton.disabled = true;

    // Collect form data
    const formData = {
        service: document.getElementById('service').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        carDetails: document.getElementById('car-details').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        name: document.getElementById('name').value
    };

    // Send email using EmailJS
    emailjs.send('service_id', 'template_id', { // Replace with your service and template IDs
        to_email: 'uncletee.carcar@gmail.com',
        from_name: formData.name,
        service: formData.service,
        date: formData.date,
        time: formData.time,
        car_details: formData.carDetails,
        contact_email: formData.email,
        contact_phone: formData.phone
    })
    .then(function() {
        // Show success message
        showNotification('Booking submitted successfully! We will contact you shortly.', 'success');
        
        // Reset form
        document.getElementById('bookingForm').reset();
        
        // Restore button state
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
    })
    .catch(function(error) {
        // Show error message
        showNotification('Oops! Something went wrong. Please try again.', 'error');
        
        // Restore button state
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
    });
});

// Contact Form Handler
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Show loading state
    const submitButton = this.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;

    // Collect form data
    const formData = {
        name: this.querySelector('input[placeholder="Your Name"]').value,
        email: this.querySelector('input[placeholder="Your Email"]').value,
        carDetails: this.querySelector('input[placeholder="Car Details (Make, Model, Year)"]').value,
        message: this.querySelector('textarea').value
    };

    // Send email using EmailJS
    emailjs.send('service_id', 'template_id', { // Replace with your service and template IDs
        to_email: 'uncletee.carcar@gmail.com',
        from_name: formData.name,
        from_email: formData.email,
        car_details: formData.carDetails,
        message: formData.message
    })
    .then(function() {
        // Show success message
        showNotification('Message sent successfully! We will get back to you soon.', 'success');
        
        // Reset form
        document.getElementById('contactForm').reset();
        
        // Restore button state
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
    })
    .catch(function(error) {
        // Show error message
        showNotification('Oops! Something went wrong. Please try again.', 'error');
        
        // Restore button state
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
    });
});

// Notification System
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <p>${message}</p>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Form Validation
function validateForm(formId) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll('input, select, textarea');
    let isValid = true;

    inputs.forEach(input => {
        if (input.required && !input.value.trim()) {
            isValid = false;
            showInputError(input, 'This field is required');
        } else {
            removeInputError(input);
        }

        // Email validation
        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                isValid = false;
                showInputError(input, 'Please enter a valid email address');
            }
        }
    });

    return isValid;
}

// Video loading handler
function handleVideoLoading() {
    const videos = document.querySelectorAll('.video-item video');
    
    videos.forEach(video => {
        const container = video.parentElement;
        container.classList.add('loading');

        // Handle successful video load
        video.addEventListener('loadeddata', function() {
            container.classList.remove('loading');
            container.classList.add('loaded');
        });

        // Handle video play
        video.addEventListener('play', function() {
            container.classList.remove('loading');
            container.classList.add('loaded');
        });

        // Handle video error
        video.addEventListener('error', function() {
            console.error('Video failed to load:', video.querySelector('source').src);
            container.classList.add('error');
            
            // Retry loading with MP4 format if it's not already MP4
            const source = video.querySelector('source');
            if (!source.src.endsWith('.MP4')) {
                const newSrc = source.src.replace(/\.[^/.]+$/, '.MP4');
                source.src = newSrc;
                source.type = 'video/mp4';
                video.load();
            }
        });

        // Force load check
        setTimeout(() => {
            if (!container.classList.contains('loaded')) {
                video.load();
            }
        }, 2000);
    });
}

// Call the handler when DOM is ready
document.addEventListener('DOMContentLoaded', handleVideoLoading);

// Ensure proper grid layout
function adjustGridLayout() {
    const videoGrid = document.querySelector('.video-grid');
    const videoGridSmall = document.querySelector('.video-grid-small');
    
    if (videoGrid && videoGridSmall) {
        const items = videoGrid.querySelectorAll('.video-item:not(.error)');
        const smallItems = videoGridSmall.querySelectorAll('.video-item:not(.error)');
        
        // Adjust main grid
        if (items.length < 3) {
            videoGrid.style.gridTemplateColumns = `repeat(${Math.max(items.length, 1)}, 1fr)`;
        }
        
        // Adjust small grid
        if (smallItems.length < 4) {
            videoGridSmall.style.gridTemplateColumns = `repeat(${Math.max(smallItems.length, 1)}, 1fr)`;
        }
    }
}

// Run layout adjustment after videos load and on resize
window.addEventListener('load', adjustGridLayout);
window.addEventListener('resize', adjustGridLayout);

// Rest of your existing JavaScript... 