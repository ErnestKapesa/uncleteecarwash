// Form Initialization
document.addEventListener('DOMContentLoaded', () => {
    initializeForms();
});

// Initialize all forms
function initializeForms() {
    const bookingForm = document.getElementById('bookingForm');
    const contactForm = document.getElementById('contactForm');

    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

// Booking Form Handler
async function handleBookingSubmit(e) {
    e.preventDefault();
    
    if (!validateForm('bookingForm')) {
        return;
    }

    const submitButton = this.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    
    try {
        setLoadingState(submitButton, '<i class="fas fa-spinner fa-spin"></i> Processing...');

        const formData = {
            service: document.getElementById('service').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            carDetails: document.getElementById('car-details').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            name: document.getElementById('name').value
        };

        await emailjs.send(
            'service_id', // Your EmailJS service ID
            'template_id', // Your EmailJS template ID
            {
                to_email: 'uncletee.carcar@gmail.com',
                from_name: formData.name,
                service: formData.service,
                date: formData.date,
                time: formData.time,
                car_details: formData.carDetails,
                contact_email: formData.email,
                contact_phone: formData.phone
            }
        );

        showNotification('Booking submitted successfully! We will contact you shortly.', 'success');
        this.reset();
    } catch (error) {
        console.error('Booking submission error:', error);
        showNotification('Oops! Something went wrong. Please try again.', 'error');
    } finally {
        resetLoadingState(submitButton, originalButtonText);
    }
}

// Contact Form Handler
async function handleContactSubmit(e) {
    e.preventDefault();

    if (!validateForm('contactForm')) {
        return;
    }

    const submitButton = this.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;

    try {
        setLoadingState(submitButton, '<i class="fas fa-spinner fa-spin"></i> Sending...');

        const formData = {
            name: this.querySelector('input[placeholder="Your Name"]').value,
            email: this.querySelector('input[placeholder="Your Email"]').value,
            carDetails: this.querySelector('input[placeholder="Car Details (Make, Model, Year)"]').value,
            message: this.querySelector('textarea').value
        };

        await emailjs.send(
            'service_id', // Your EmailJS service ID
            'template_id', // Your EmailJS template ID
            {
                to_email: 'uncletee.carcar@gmail.com',
                from_name: formData.name,
                from_email: formData.email,
                car_details: formData.carDetails,
                message: formData.message
            }
        );

        showNotification('Message sent successfully! We will get back to you soon.', 'success');
        this.reset();
    } catch (error) {
        console.error('Contact form submission error:', error);
        showNotification('Oops! Something went wrong. Please try again.', 'error');
    } finally {
        resetLoadingState(submitButton, originalButtonText);
    }
}

// Helper Functions
function setLoadingState(button, loadingText) {
    button.innerHTML = loadingText;
    button.disabled = true;
}

function resetLoadingState(button, originalText) {
    button.innerHTML = originalText;
    button.disabled = false;
}

// Notification System
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <p>${message}</p>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Use requestAnimationFrame for smoother animations
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });
    
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

function showInputError(input, message) {
    const errorDiv = input.parentElement.querySelector('.error-message') || document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    if (!input.parentElement.querySelector('.error-message')) {
        input.parentElement.appendChild(errorDiv);
    }
    
    input.classList.add('error');
}

function removeInputError(input) {
    const errorDiv = input.parentElement.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
    input.classList.remove('error');
} 