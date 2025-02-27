// Preloader Handler
document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.querySelector('.preloader');
    
    // Ensure all images are loaded
    const images = document.querySelectorAll('img');
    let loadedImages = 0;
    
    function imageLoaded() {
        loadedImages++;
        if (loadedImages === images.length) {
            // All images loaded
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                    document.body.style.overflow = 'visible';
                }, 500);
            }, 1000);
        }
    }
    
    // Add load event listener to each image
    images.forEach(img => {
        if (img.complete) {
            imageLoaded();
        } else {
            img.addEventListener('load', imageLoaded);
            img.addEventListener('error', imageLoaded); // Handle error cases
        }
    });
    
    // Fallback in case no images are present
    if (images.length === 0) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                document.body.style.overflow = 'visible';
            }, 500);
        }, 1000);
    }
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

// Rest of your existing JavaScript... 