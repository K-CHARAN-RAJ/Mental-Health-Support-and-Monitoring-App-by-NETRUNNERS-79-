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

// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for scroll animations
const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 100);
        }
    });
}, observerOptions);

// Observe all elements with animation attributes
const animatedElements = document.querySelectorAll('[data-animation="fade-in"]');
animatedElements.forEach(el => observer.observe(el));

// Also observe feature cards, steps, privacy cards, and mood bubbles
const featureCards = document.querySelectorAll('.feature-card');
const steps = document.querySelectorAll('.step');
const privacyCards = document.querySelectorAll('.privacy-card');
const moodBubbles = document.querySelectorAll('.mood-bubble');

featureCards.forEach(card => observer.observe(card));
steps.forEach(step => observer.observe(step));
privacyCards.forEach(card => observer.observe(card));
moodBubbles.forEach(bubble => observer.observe(bubble));

// Modal functionality
const modal = document.getElementById('signupModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const getStartedButtons = [
    document.getElementById('getStartedNav'),
    document.getElementById('startJourney'),
    document.getElementById('startFree')
];

// Open modal
function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Add event listeners to all "Get Started" buttons
getStartedButtons.forEach(button => {
    if (button) {
        button.addEventListener('click', openModal);
    }
});

// Close modal on overlay click
if (modalOverlay) {
    modalOverlay.addEventListener('click', closeModal);
}

// Close modal on close button click
if (modalClose) {
    modalClose.addEventListener('click', closeModal);
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

// Handle signup form submission
const signupForm = document.querySelector('.signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const interest = document.getElementById('interest').value;
        
        // Show success message (in real app, this would be an API call)
        alert(`Welcome to SerenAI, ${name}! We'll send you an email at ${email} to get started on your wellness journey.`);
        
        // Close modal and reset form
        closeModal();
        signupForm.reset();
    });
}

// Newsletter form submission
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        alert(`Thank you for subscribing! We'll send updates to ${email}`);
        newsletterForm.reset();
    });
}

// Add parallax effect to hero section
const hero = document.querySelector('.hero');
if (hero) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        hero.style.transform = `translateY(${parallax}px)`;
    });
}

// Add staggered animation delay to feature cards
featureCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
});

// Add staggered animation delay to steps
steps.forEach((step, index) => {
    step.style.transitionDelay = `${index * 0.15}s`;
});

// Add staggered animation delay to privacy cards
privacyCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
});

// Add staggered animation delay to mood bubbles
moodBubbles.forEach((bubble, index) => {
    bubble.style.transitionDelay = `${index * 0.15}s`;
});

// Logo click to scroll to top
const logo = document.querySelector('.nav-logo');
if (logo) {
    logo.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Add pulse animation to CTA buttons
const ctaButtons = document.querySelectorAll('.cta-section .btn-primary');
ctaButtons.forEach(button => {
    setInterval(() => {
        button.style.animation = 'none';
        setTimeout(() => {
            button.style.animation = 'pulse 2s ease-in-out';
        }, 10);
    }, 5000);
});

// Initialize - trigger animations for elements already in view
window.addEventListener('load', () => {
    const viewportElements = document.querySelectorAll('[data-animation="fade-in"]');
    viewportElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.classList.add('visible');
        }
    });
});

console.log('SerenAI - Your journey to emotional wellness begins here 💜');