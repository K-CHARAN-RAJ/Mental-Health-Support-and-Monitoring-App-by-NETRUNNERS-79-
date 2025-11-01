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

// About Us Modal Functionality
const aboutUsLink = document.getElementById('aboutUsLink');
if (aboutUsLink) {
    aboutUsLink.addEventListener('click', function(e) {
        e.preventDefault();

        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center;';

        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.style.cssText = 'background: white; padding: 40px; border-radius: 20px; max-width: 600px; width: 90%; box-shadow: 0 10px 40px rgba(0,0,0,0.3); position: relative;';

        modalContent.innerHTML = `
            <button style="position: absolute; top: 15px; right: 15px; background: none; border: none; font-size: 30px; cursor: pointer; color: #666; line-height: 1;">&times;</button>
            <h2 style="color: #7c3aed; margin-bottom: 20px; font-size: 28px;">About Us</h2>
            <h3 style="color: #333; margin-bottom: 15px; font-size: 20px;">Team NETRUNNERS - 79</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <thead>
                    <tr style="background: #f3f4f6;">
                        <th style="padding: 12px; text-align: left; border-bottom: 2px solid #7c3aed;">Name</th>
                        <th style="padding: 12px; text-align: left; border-bottom: 2px solid #7c3aed;">Roll Number</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">KATTA CHARAN RAJ</td>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">24671A7394</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">GADDAM ALEKHYA</td>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">24671A7382</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">KOONA SAISIRI</td>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">24671A7397</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px;">GONIABBA RAJADATTA GOUD</td>
                        <td style="padding: 12px;">24671A7321</td>
                    </tr>
                </tbody>
            </table>
        `;

        overlay.appendChild(modalContent);
        document.body.appendChild(overlay);

        // Close modal on overlay click
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });

        // Close modal on close button click
        const closeBtn = modalContent.querySelector('button');
        closeBtn.addEventListener('click', function() {
            document.body.removeChild(overlay);
        });
    });
}

// Contact Modal Functionality
const contactLink = document.getElementById('contactLink');
if (contactLink) {
    contactLink.addEventListener('click', function(e) {
        e.preventDefault();

        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center;';

        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.style.cssText = 'background: white; padding: 40px; border-radius: 20px; max-width: 500px; width: 90%; box-shadow: 0 10px 40px rgba(0,0,0,0.3); position: relative; text-align: center;';

        modalContent.innerHTML = `
            <button style="position: absolute; top: 15px; right: 15px; background: none; border: none; font-size: 30px; cursor: pointer; color: #666; line-height: 1;">&times;</button>
            <div style="font-size: 60px; margin-bottom: 20px;">📧</div>
            <h2 style="color: #7c3aed; margin-bottom: 15px; font-size: 28px;">Contact Us</h2>
            <p style="color: #666; margin-bottom: 25px; font-size: 16px;">Get in touch with us via email</p>
            <a href="mailto:kattacharanraj@gmail.com" style="color: #7c3aed; font-size: 20px; text-decoration: none; font-weight: 600; word-break: break-all;">kattacharanraj@gmail.com</a>
            <p style="margin-top: 25px; color: #999; font-size: 14px;">We'll get back to you as soon as possible!</p>
        `;

        overlay.appendChild(modalContent);
        document.body.appendChild(overlay);

        // Close modal on overlay click
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });

        // Close modal on close button click
        const closeBtn = modalContent.querySelector('button');
        closeBtn.addEventListener('click', function() {
            document.body.removeChild(overlay);
        });
    });
}
