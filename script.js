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

// Rest of your existing JavaScript... 