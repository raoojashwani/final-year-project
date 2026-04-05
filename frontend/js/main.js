document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. MODALS (Booking & Video)
    ========================================= */
    const bookingModal = document.getElementById('bookingModal');
    const videoModal = document.getElementById('videoModal');
    const showreelIframe = document.getElementById('showreelIframe');
    
    // Save the original YouTube source to reset it (stops video on close)
    const originalSrc = showreelIframe ? showreelIframe.src : '';

    // --- Booking Modal ---
    const openBookingBtn = document.getElementById('openBookingBtn');
    if (openBookingBtn && bookingModal) {
        openBookingBtn.addEventListener('click', () => {
            bookingModal.classList.add('active');
        });
    }

    const closeBookingBtn = document.getElementById('closeBooking');
    if (closeBookingBtn && bookingModal) {
        closeBookingBtn.addEventListener('click', () => {
            bookingModal.classList.remove('active');
        });
    }

    // --- Video Modal ---
    const openVideoBtns = [
        document.getElementById('openShowreelBtn'), 
        document.getElementById('openShowreelBtn2')
    ];
    
    openVideoBtns.forEach(btn => {
        if (btn && videoModal) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                videoModal.classList.add('active');
                // Append autoplay parameter so it starts immediately
                if (showreelIframe) showreelIframe.src = originalSrc + "&autoplay=1";
            });
        }
    });

    const closeVideoBtn = document.getElementById('closeVideo');
    if (closeVideoBtn && videoModal) {
        closeVideoBtn.addEventListener('click', () => {
            videoModal.classList.remove('active');
            // Reset source to stop the video playback in the background
            if (showreelIframe) showreelIframe.src = originalSrc; 
        });
    }
    
    // --- Close Modals on Outside Click ---
    window.addEventListener('click', (e) => {
        if (e.target === bookingModal) {
            bookingModal.classList.remove('active');
        }
        if (e.target === videoModal) {
            videoModal.classList.remove('active');
            if (showreelIframe) showreelIframe.src = originalSrc;
        }
    });


    /* =========================================
       2. NAVBAR & MOBILE MENU
    ========================================= */
    const navbar = document.getElementById('navbar');
    if (navbar) {
        // Add glass effect on scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'var(--color-ivory)'; // Match theme
                navLinks.style.padding = '20px';
                navLinks.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
            }
        });
    }


    /* =========================================
       3. TABS (Services Section)
    ========================================= */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons and contents
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked button and corresponding content
                btn.classList.add('active');
                const targetId = btn.getAttribute('data-tab');
                const targetContent = document.getElementById(targetId);
                if (targetContent) targetContent.classList.add('active');
            });
        });
    }


    /* =========================================
       4. PORTFOLIO FILTER
    ========================================= */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state on buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filterValue = btn.getAttribute('data-filter');
                
                // Filter items
                galleryItems.forEach(item => {
                    if (filterValue === 'all' || item.classList.contains(filterValue)) {
                        item.style.display = 'block';
                        // Slight delay for smooth animation
                        setTimeout(() => { 
                            item.style.opacity = '1'; 
                            item.style.transform = 'scale(1)'; 
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.9)';
                        // Wait for fade out before hiding completely
                        setTimeout(() => { 
                            item.style.display = 'none'; 
                        }, 300);
                    }
                });
            });
        });
    }


    /* =========================================
       5. SCROLL ANIMATIONS (Intersection Observer)
    ========================================= */
    // Fade Up Elements
    const revealElements = document.querySelectorAll('.fade-up-slow');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Only animate once
                }
            });
        }, { threshold: 0.15 });
        
        revealElements.forEach(el => revealObserver.observe(el));
    }

    // Number Counters (Authority Strip)
    const counters = document.querySelectorAll('.counter');
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = +counter.getAttribute('data-target');
                    // Calculate increment based on desired animation duration
                    const increment = target / (2000 / 16); // roughly 2 seconds
                    let current = 0;
                    
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.innerText = Math.ceil(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    
                    updateCounter();
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => counterObserver.observe(counter));
    }

});


/* =========================================
   6. EXTERNAL LIBRARIES INITIALIZATION
   (Runs on window load to ensure all assets are ready)
========================================= */
window.addEventListener('load', () => {
    
    // --- Preloader ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.transition = 'opacity 0.8s ease';
            setTimeout(() => preloader.style.display = 'none', 800);
        }, 1200); // Gives time to show the logo and animation
    }

    // --- GSAP ScrollTrigger (Timeline Line) ---
    // Make sure GSAP and ScrollTrigger are loaded in your HTML before this runs
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        const timelineLine = document.getElementById('gsap-line');
        if (timelineLine) {
            gsap.fromTo(timelineLine, 
                { height: "0%" }, 
                {
                    height: "100%", 
                    ease: "none",
                    scrollTrigger: { 
                        trigger: ".vertical-timeline", 
                        start: "top center", 
                        end: "bottom center", 
                        scrub: 1 
                    }
                }
            );
        }
    }

    // --- Swiper.js (Testimonials) ---
    // Make sure Swiper is loaded in your HTML before this runs
    if (typeof Swiper !== 'undefined') {
        const testimonialSwiper = document.querySelector('.testimonialSwiper');
        if (testimonialSwiper) {
            new Swiper('.testimonialSwiper', {
                slidesPerView: 1, 
                spaceBetween: 30, 
                loop: true,
                autoplay: { 
                    delay: 5000, 
                    disableOnInteraction: false 
                },
                pagination: { 
                    el: '.swiper-pagination', 
                    clickable: true 
                },
                effect: 'fade', 
                fadeEffect: { 
                    crossFade: true 
                }
            });
        }
    }
});