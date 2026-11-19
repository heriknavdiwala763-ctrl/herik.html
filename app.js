/**
 * AAKAR FILMS — Master Scroll Animations & Interactions
 * Powered by GSAP 3 & ScrollTrigger
 * Desktop & Mobile Multi-Device Optimized
 */

document.addEventListener('DOMContentLoaded', () => {
  // Register GSAP plugins
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Initialize all interactive modules
  initPointerAndCursorSystem();
  initNavbarScroll();
  initMobileMenu();
  initHeroAnimations();
  initThreeColumnScrollGallery();
  initSectionScrollReveals();
  initCounters();
  initTestimonials();
  initBookingForm();
  initLightbox();
});

/**
 * 1. POINTER & CURSOR SYSTEM (DESKTOP CURSOR + MOBILE TOUCH RIPPLE)
 * Supports Mouse, Touch, and Hybrid (laptop touchscreens) seamlessly.
 */
function initPointerAndCursorSystem() {
  const cursor = document.getElementById('customCursor');
  const follower = document.getElementById('customCursorFollower');
  const isTouchDevice = window.matchMedia('(hover: none) or (pointer: coarse)').matches;

  // On desktop / fine pointer devices: Enable smooth magnetic custom cursor
  if (!isTouchDevice && cursor && follower) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let followerX = mouseX;
    let followerY = mouseY;
    let isMoving = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

      if (!isMoving) {
        cursor.style.opacity = '1';
        follower.style.opacity = '1';
        isMoving = true;
      }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      follower.style.opacity = '0';
      isMoving = false;
    });

    if (typeof gsap !== 'undefined') {
      gsap.ticker.add(() => {
        followerX += (mouseX - followerX) * 0.18;
        followerY += (mouseY - followerY) * 0.18;
        follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;
      });
    }

    // Interactive element hover states
    const interactives = document.querySelectorAll('a, button, input, select, textarea, .gallery-card, .menu-toggle');
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        follower.style.transform += ' scale(1.6)';
        follower.style.borderColor = 'rgba(212, 175, 55, 0.85)';
      });
      el.addEventListener('mouseleave', () => {
        follower.style.borderColor = 'rgba(255, 255, 255, 0.45)';
      });
    });
  }

  // Mobile / Touch Devices: Animated Subtle Luxury Touch Feedback
  window.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0]) {
      const touch = e.touches[0];
      createTouchRipple(touch.clientX, touch.clientY);
    }
  }, { passive: true });

  function createTouchRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'touch-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    document.body.appendChild(ripple);

    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }
}

/**
 * 2. Sticky Glassmorphism Header on Scroll
 */
function initNavbarScroll() {
  const nav = document.getElementById('headerNav');
  if (!nav) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/**
 * 3. Mobile Navigation Drawer (Full Backdrop, Animated Toggle & Auto-Close)
 */
function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('mobileDrawerOverlay');
  const closeBtn = document.getElementById('mobileDrawerClose');
  const links = document.querySelectorAll('.mobile-link');

  if (!toggle || !drawer) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    if (overlay) overlay.classList.add('active');
    toggle.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (drawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  links.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/**
 * 4. Hero Entrance Animations
 */
function initHeroAnimations() {
  if (typeof gsap === 'undefined') return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from('.hero-badge', { opacity: 0, y: -20, duration: 0.9, delay: 0.15 })
    .from('.hero-logo-box', { opacity: 0, scale: 0.92, duration: 1.2 }, '-=0.5')
    .from('.hero-subtitle', { opacity: 0, y: 20, duration: 0.8 }, '-=0.6')
    .from('.hero-tagline', { opacity: 0, y: 15, duration: 0.7 }, '-=0.5')
    .from('.hero-scroll-indicator', { opacity: 0, duration: 0.8 }, '-=0.3');
}

/**
 * 5. THE MAIN 3-COLUMN IMAGE SCROLL ANIMATION
 * Supports:
 * - Desktop: Complete 3-Column Opposite Scrubbing
 * - Mobile / Tablet: Smooth 2-Column Coordinated Parallax
 * - Ultra-compact (<360px): Fluid Single-Column Parallax
 */
function initThreeColumnScrollGallery() {
  const section = document.querySelector('.gallery-scroll-section');
  const track1 = document.getElementById('track1');
  const track2 = document.getElementById('track2');
  const track3 = document.getElementById('track3');

  if (!section || !track1 || !track2 || !track3 || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  let currentTrigger = null;

  const setupAnimation = () => {
    // Kill existing ScrollTriggers on this section
    ScrollTrigger.getAll().forEach(st => {
      if (st.vars.id === '3column-scroll') st.kill();
    });

    const screenWidth = window.innerWidth;

    if (screenWidth <= 360) {
      // Ultra-compact phone: 1 Column parallax
      gsap.fromTo(track1,
        { yPercent: 15 },
        {
          yPercent: -40,
          ease: 'none',
          scrollTrigger: {
            id: '3column-scroll',
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.8
          }
        }
      );
    } else if (screenWidth <= 768) {
      // Mobile / Compact: 2-Column Opposite Movement
      // Track 1 moves UP, Track 2 moves DOWN
      gsap.fromTo(track1,
        { yPercent: 12 },
        {
          yPercent: -35,
          ease: 'none',
          scrollTrigger: {
            id: '3column-scroll',
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.8
          }
        }
      );

      gsap.fromTo(track2,
        { yPercent: -35 },
        {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            id: '3column-scroll',
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.8
          }
        }
      );
    } else {
      // Desktop / Tablet: Full 3-Column Opposite Choreography
      gsap.fromTo(track1,
        { yPercent: 20 },
        {
          yPercent: -50,
          ease: 'none',
          scrollTrigger: {
            id: '3column-scroll',
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.2
          }
        }
      );

      gsap.fromTo(track2,
        { yPercent: -50 },
        {
          yPercent: 20,
          ease: 'none',
          scrollTrigger: {
            id: '3column-scroll',
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.2
          }
        }
      );

      gsap.fromTo(track3,
        { yPercent: 25 },
        {
          yPercent: -55,
          ease: 'none',
          scrollTrigger: {
            id: '3column-scroll',
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.2
          }
        }
      );
    }
  };

  setupAnimation();

  // Resize handler with debounce
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      setupAnimation();
      ScrollTrigger.refresh();
    }, 200);
  }, { passive: true });
}

/**
 * 6. Section Scroll Reveals & Card Animations
 */
function initSectionScrollReveals() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  // Services Cards stagger
  gsap.from('.service-card', {
    scrollTrigger: {
      trigger: '.services-grid',
      start: 'top 85%',
      toggleActions: 'play none none reverse'
    },
    opacity: 0,
    y: 35,
    stagger: 0.12,
    duration: 0.8,
    ease: 'power2.out'
  });

  // Featured Stories reveal
  const stories = document.querySelectorAll('.story-row');
  stories.forEach((story) => {
    gsap.from(story.querySelectorAll('.story-image-wrap, .story-text-wrap'), {
      scrollTrigger: {
        trigger: story,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 35,
      stagger: 0.15,
      duration: 0.9,
      ease: 'power3.out'
    });
  });

  // About Section reveal
  gsap.from('.about-frame, .about-content', {
    scrollTrigger: {
      trigger: '.about-grid',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    },
    opacity: 0,
    y: 40,
    stagger: 0.2,
    duration: 1,
    ease: 'power3.out'
  });
}

/**
 * 7. Animated Statistics Counters
 */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length || typeof ScrollTrigger === 'undefined') return;

  ScrollTrigger.create({
    trigger: '.stats-section',
    start: 'top 85%',
    once: true,
    onEnter: () => {
      counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 1800;
        let start = 0;
        const stepTime = 30;
        const steps = duration / stepTime;
        const increment = target / steps;

        const timer = setInterval(() => {
          start += increment;
          if (start >= target) {
            counter.innerText = target;
            clearInterval(timer);
          } else {
            counter.innerText = Math.ceil(start);
          }
        }, stepTime);
      });
    }
  });
}

/**
 * 8. Testimonials Carousel with Touch Swipe Support
 */
function initTestimonials() {
  const container = document.querySelector('.testimonial-carousel-container');
  const slider = document.getElementById('testimonialSlider');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');
  const dots = document.querySelectorAll('.dot');
  if (!slider || !prevBtn || !nextBtn) return;

  let currentIndex = 0;
  const totalSlides = dots.length;
  let autoplayTimer = null;

  const updateSlide = (index) => {
    slider.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === index);
    });
    currentIndex = index;
  };

  const nextSlide = () => {
    let next = (currentIndex + 1) % totalSlides;
    updateSlide(next);
  };

  const prevSlide = () => {
    let prev = (currentIndex - 1 + totalSlides) % totalSlides;
    updateSlide(prev);
  };

  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = +dot.getAttribute('data-index');
      updateSlide(idx);
    });
  });

  // Touch Swipe for Mobile
  if (container) {
    let touchStartX = 0;
    let touchEndX = 0;

    container.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      clearInterval(autoplayTimer);
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      startAutoplay();
    }, { passive: true });

    const handleSwipe = () => {
      const threshold = 40;
      if (touchStartX - touchEndX > threshold) {
        nextSlide();
      } else if (touchEndX - touchStartX > threshold) {
        prevSlide();
      }
    };
  }

  const startAutoplay = () => {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(nextSlide, 7000);
  };

  startAutoplay();
}

/**
 * 9. Inquiry Form Submission & Validation
 */
function initBookingForm() {
  const form = document.getElementById('inquiryForm');
  const status = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');
  if (!form || !status) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    submitBtn.innerText = 'Transmitting Reservation...';
    submitBtn.disabled = true;

    // Simulate luxury API handling (or connect with Supabase)
    setTimeout(() => {
      status.classList.add('success');
      form.reset();
      submitBtn.innerText = 'Inquiry Sent Successfully ✓';
      setTimeout(() => {
        submitBtn.innerText = 'Send Booking Inquiry';
        submitBtn.disabled = false;
      }, 5000);
    }, 1000);
  });
}

/**
 * 10. Lightbox Modal for Gallery Images (Touch, Click & Esc Supported)
 */
function initLightbox() {
  const modal = document.getElementById('lightboxModal');
  const img = document.getElementById('lightboxImg');
  const closeBtn = document.getElementById('lightboxClose');
  const cards = document.querySelectorAll('.gallery-card');

  if (!modal || !img || !closeBtn) return;

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const fullSrc = card.getAttribute('data-lightbox');
      if (fullSrc) {
        img.src = fullSrc;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}
