/* ========================================
    PORTFOLIO GALLERY JAVASCRIPT
======================================== */

// Gallery Lightbox
let galleryImages = [];
let galleryIndex = 0;
const GALLERY_SWIPE_THRESHOLD = 50;

function initGalleryLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    
    if (!lightbox || !lightboxImg) return;
    
    // Get all gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const imgSrc = item.getAttribute('href');
            galleryImages = Array.from(galleryItems).map(el => el.getAttribute('href'));
            galleryIndex = index;
            openGalleryLightbox(imgSrc);
        });
    });
    
    // Close lightbox
    if (closeBtn) {
        closeBtn.addEventListener('click', closeGalleryLightbox);
    }
    
    // Close on background click
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeGalleryLightbox();
            }
        });
    }
    
    // Navigation - make sure buttons work
    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            navigateGallery(-1);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            navigateGallery(1);
        });
    }

    // Swipe navigation for mobile
    addSwipeSupportToGalleryLightbox(lightbox);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('show')) return;
        
        if (e.key === 'Escape') {
            closeGalleryLightbox();
        } else if (e.key === 'ArrowLeft') {
            navigateGallery(-1);
        } else if (e.key === 'ArrowRight') {
            navigateGallery(1);
        }
    });
}

function addSwipeSupportToGalleryLightbox(element) {
    if (!element) return;

    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;

    element.addEventListener('touchstart', (e) => {
        if (!e.touches || e.touches.length === 0) return;

        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        endX = startX;
        endY = startY;
    }, { passive: true });

    element.addEventListener('touchmove', (e) => {
        if (!e.touches || e.touches.length === 0) return;

        endX = e.touches[0].clientX;
        endY = e.touches[0].clientY;
    }, { passive: true });

    element.addEventListener('touchend', () => {
        if (!galleryImages.length || galleryImages.length <= 1) return;

        const diffX = endX - startX;
        const diffY = endY - startY;

        // Solo actuar si el gesto es claramente horizontal
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > GALLERY_SWIPE_THRESHOLD) {
            if (diffX < 0) {
                navigateGallery(1);
            } else {
                navigateGallery(-1);
            }
        }
    }, { passive: true });
}

function openGalleryLightbox(src) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    
    // Get fresh gallery images each time
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryImages = Array.from(galleryItems).map(el => el.getAttribute('href'));
    galleryIndex = galleryImages.indexOf(src);
    if (galleryIndex === -1) galleryIndex = 0;
    
    // Close if already open - wait for close to complete
    if (lightbox) {
        lightbox.classList.remove('show');
        setTimeout(() => {
            if (lightbox && lightboxImg) {
                lightboxImg.src = src;
                lightbox.classList.add('show');
                document.body.style.overflow = 'hidden';
            }
        }, 100);
    }
}

function closeGalleryLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('show');
        document.body.style.overflow = '';
    }
    
    // Also close modal if open (UX improvement)
    const modal = document.getElementById('experience-modal');
    if (modal && modal.classList.contains('show')) {
        modal.classList.remove('show');
    }
    
    // Reset gallery state
    galleryImages = [];
    galleryIndex = 0;
}

function navigateGallery(direction) {
    if (!galleryImages.length) return;

    galleryIndex = (galleryIndex + direction + galleryImages.length) % galleryImages.length;
    const lightboxImg = document.getElementById('lightbox-img');
    if (lightboxImg && galleryImages[galleryIndex]) {
        lightboxImg.src = galleryImages[galleryIndex];
    }
}

// Parallax Effect for Page Header
function initParallax() {
    const headerBg = document.querySelector('.portfolio-page-bg img');
    
    if (!headerBg) return;
    
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const headerRect = document.querySelector('.portfolio-page-header').getBoundingClientRect();
                const headerHeight = document.querySelector('.portfolio-page-header').offsetHeight;
                
                if (headerRect.bottom > 0) {
                    // Calculate parallax - only move down when scrolling down, stay in place when scrolling up
                    const parallaxOffset = Math.max(-headerHeight * 0.2, Math.min(scrolled * 0.3, headerHeight * 0.3));
                    headerBg.style.transform = `translateY(${parallaxOffset}px)`;
                }
                
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initGalleryLightbox();
    initParallax();
});