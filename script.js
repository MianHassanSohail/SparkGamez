// Quantum Forge Games - Interactive JavaScript

// Global variables
let isMenuOpen = false;
let scrollPosition = 0;
let isScrolling = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize all components
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeContactForm();
    initializeMobileMenu();
    initializeScrollIndicator();
    initializeForms();
    
    // Add loading complete class
    document.body.classList.add('loaded');
    
    console.log('Spark Games website initialized');
}

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Add click handlers for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-section');
            scrollToSection(targetId);
            
            // Close mobile menu if open
            if (isMenuOpen) {
                toggleMobileMenu();
            }
        });
    });
    
    // Update active navigation on scroll
    window.addEventListener('scroll', throttle(updateActiveNavigation, 100));
}

function scrollToSection(sectionId) {
    const target = document.getElementById(sectionId);
    if (target) {
        const offsetTop = target.offsetTop - 80; // Account for fixed header
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
        
        // Add loading animation to target section
        target.classList.add('loading-animation');
        setTimeout(() => {
            target.classList.remove('loading-animation');
        }, 1000);
    }
}

function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        
        if (scrollPos >= top && scrollPos <= top + height) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-section') === id) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Scroll effects
function initializeScrollEffects() {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', throttle(function() {
        const scrolled = window.scrollY;
        
        // Update navbar background opacity based on scroll
        if (scrolled > 50) {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            navbar.style.borderBottomColor = 'rgba(0, 245, 255, 0.3)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.9)';
            navbar.style.borderBottomColor = 'rgba(0, 245, 255, 0.2)';
        }
        
        // Parallax effect for hero section
        const hero = document.getElementById('home');
        if (hero && scrolled < hero.offsetHeight) {
            const parallaxSpeed = scrolled * 0.5;
            hero.style.transform = `translateY(${parallaxSpeed}px)`;
        }
        
        scrollPosition = scrolled;
    }, 10));
}

// Animation system
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-slide-in');
                
                // Add stagger effect for cards
                if (entry.target.classList.contains('game-card') || 
                    entry.target.classList.contains('career-card') || 
                    entry.target.classList.contains('team-card')) {
                    addStaggerAnimation(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe all animatable elements
    const animatableElements = document.querySelectorAll(
        '.glass-card, .game-card, .career-card, .team-card, .glow-text'
    );
    
    animatableElements.forEach(el => {
        observer.observe(el);
    });
    
    // Add hover sound effects (visual feedback)
    addHoverEffects();
}

function addStaggerAnimation(element) {
    const siblings = Array.from(element.parentNode.children);
    const index = siblings.indexOf(element);
    
    setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }, index * 100);
}

function addHoverEffects() {
    // Add pulse effect to glow buttons
    const glowButtons = document.querySelectorAll('.glow-button');
    glowButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.animation = 'glow-pulse 0.5s ease-in-out';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.animation = '';
        });
        
        button.addEventListener('click', function() {
            // Add click ripple effect
            const ripple = document.createElement('div');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add glow effect to cards on hover
    const cards = document.querySelectorAll('.glass-card, .game-card, .career-card, .team-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Mobile menu functionality
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
}

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    
    isMenuOpen = !isMenuOpen;
    
    if (isMenuOpen) {
        mobileMenu.classList.remove('hidden');
        mobileMenuBtn.innerHTML = '<i class="fas fa-times text-2xl"></i>';
        mobileMenu.style.animation = 'slide-in 0.3s ease-out';
    } else {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars text-2xl"></i>';
    }
}

// Contact form functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
        
        // Add real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    }
}

function handleContactFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name') || document.getElementById('name').value,
        email: formData.get('email') || document.getElementById('email').value,
        subject: formData.get('subject') || document.getElementById('subject').value,
        message: formData.get('message') || document.getElementById('message').value
    };
    
    // Validate form
    if (validateContactForm(data)) {
        // Show loading state
        const submitButton = e.target.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
        submitButton.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            e.target.reset();
            
            // Reset button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }, 2000);
    }
}

function validateContactForm(data) {
    let isValid = true;
    
    // Validate name
    if (!data.name || data.name.trim().length < 2) {
        showFieldError('name', 'Please enter a valid name (at least 2 characters)');
        isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate message
    if (!data.message || data.message.trim().length < 10) {
        showFieldError('message', 'Please enter a message (at least 10 characters)');
        isValid = false;
    }
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    switch (field.id) {
        case 'name':
            if (value.length < 2) {
                showFieldError('name', 'Name must be at least 2 characters long');
                return false;
            }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError('email', 'Please enter a valid email address');
                return false;
            }
            break;
        case 'message':
            if (value.length < 10) {
                showFieldError('message', 'Message must be at least 10 characters long');
                return false;
            }
            break;
    }
    
    clearFieldError(field.id);
    return true;
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorId = `${fieldId}-error`;
    
    // Remove existing error
    const existingError = document.getElementById(errorId);
    if (existingError) {
        existingError.remove();
    }
    
    // Add error styling
    field.style.borderColor = '#ef4444';
    field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
    
    // Create error message
    const errorElement = document.createElement('div');
    errorElement.id = errorId;
    errorElement.className = 'text-red-400 text-sm mt-1';
    errorElement.textContent = message;
    
    field.parentNode.insertBefore(errorElement, field.nextSibling);
}

function clearFieldError(fieldId) {
    const field = typeof fieldId === 'string' ? document.getElementById(fieldId) : fieldId.target;
    const errorId = `${field.id}-error`;
    const errorElement = document.getElementById(errorId);
    
    if (errorElement) {
        errorElement.remove();
    }
    
    // Reset field styling
    field.style.borderColor = '';
    field.style.boxShadow = '';
}

// Scroll progress indicator
function initializeScrollIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'scroll-indicator';
    
    const progress = document.createElement('div');
    progress.style.width = '0%';
    progress.style.height = '100%';
    progress.style.background = 'linear-gradient(90deg, #00f5ff, #8b5cf6, #ec4899)';
    progress.style.transition = 'width 0.1s ease';
    
    indicator.appendChild(progress);
    document.body.appendChild(indicator);
    
    window.addEventListener('scroll', throttle(function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progress.style.width = Math.min(scrollPercent, 100) + '%';
    }, 10));
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 max-w-md p-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300`;
    
    // Set notification style based on type
    switch (type) {
        case 'success':
            notification.classList.add('bg-green-500', 'text-white');
            break;
        case 'error':
            notification.classList.add('bg-red-500', 'text-white');
            break;
        case 'warning':
            notification.classList.add('bg-yellow-500', 'text-black');
            break;
        default:
            notification.classList.add('bg-blue-500', 'text-white');
    }
    
    notification.innerHTML = `
        <div class="flex items-center justify-between">
            <div class="flex items-center">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} mr-2"></i>
                <span>${message}</span>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-lg">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Utility functions
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance monitoring
function monitorPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            const perfData = performance.timing;
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            
            console.log(`Page loaded in ${loadTime}ms`);
            
            // Log performance metrics for optimization
            if (loadTime > 3000) {
                console.warn('Page load time is high. Consider optimization.');
            }
        });
    }
}

// Initialize performance monitoring
monitorPerformance();

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape' && isMenuOpen) {
        toggleMobileMenu();
    }
    
    // Arrow keys for navigation (when not in form fields)
    if (!e.target.matches('input, textarea, select')) {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            window.scrollBy(0, 100);
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            window.scrollBy(0, -100);
        }
    }
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 215, 0, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// New form handling functionality
function initializeForms() {
    // Add form listeners if forms exist
    const contactForm = document.getElementById('contactForm');
    const applicationForm = document.getElementById('applicationForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
    
    if (applicationForm) {
        applicationForm.addEventListener('submit', handleApplicationSubmit);
    }
}

// Contact form handler
function handleContactSubmit(event) {
    event.preventDefault();

    const submitBtn = document.getElementById('contactSubmitBtn');
    const messageDiv = document.getElementById('contactFormMessage');
    const form = event.target;

    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
    submitBtn.disabled = true;

    const formData = new FormData(form);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };

    // Send using EmailJS
    emailjs.send('Yservice_56y9afp', 'YOUR_CONTACT_TEMPLATE_ID', {
        from_name: data.name,
        from_email: data.email,
        subject: data.subject,
        message: data.message,
        to_email: 'sparkgamezstudio@gmail.com'
    }).then(() => {
        messageDiv.className = 'text-center py-4 text-spark-cyan';
        messageDiv.innerHTML = '<i class="fas fa-check-circle mr-2"></i>Message sent successfully! We\'ll get back to you soon.';
        messageDiv.classList.remove('hidden');
        form.reset();
        submitBtn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>Send Message';
        submitBtn.disabled = false;
        setTimeout(() => {
            messageDiv.classList.add('hidden');
        }, 5000);
    }, (error) => {
        messageDiv.className = 'text-center py-4 text-red-500';
        messageDiv.innerHTML = '<i class="fas fa-times-circle mr-2"></i>Failed to send message. Please try again later.';
        messageDiv.classList.remove('hidden');
        submitBtn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>Send Message';
        submitBtn.disabled = false;
    });
}



// Application modal functions
function openApplicationModal(position) {
    const modal = document.getElementById('applicationModal');
    const modalTitle = document.getElementById('modalTitle');
    const positionInput = document.getElementById('applicationPosition');
    
    modalTitle.textContent = `Apply for ${position}`;
    positionInput.value = position;
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeApplicationModal() {
    const modal = document.getElementById('applicationModal');
    const form = document.getElementById('applicationForm');
    const messageDiv = document.getElementById('applicationFormMessage');
    
    modal.classList.add('hidden');
    document.body.style.overflow = '';
    
    // Reset form and message
    form.reset();
    messageDiv.classList.add('hidden');
}

// Application form handler
function handleApplicationSubmit(event) {
    event.preventDefault();

    const submitBtn = document.getElementById('applicationSubmitBtn');
    const messageDiv = document.getElementById('applicationFormMessage');
    const form = event.target;

    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Submitting...';
    submitBtn.disabled = true;

    const formData = new FormData(form);

    const emailParams = {
        position: formData.get('position'),
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        portfolio: formData.get('portfolio'),
        experience: formData.get('experience'),
        coverLetter: formData.get('coverLetter')
    };

    const resumeFile = formData.get('resume');
    if (resumeFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            emailParams.resume_base64 = e.target.result.split(',')[1];
            sendApplicationEmail(emailParams, submitBtn, messageDiv, form);
        };
        reader.readAsDataURL(resumeFile);
    } else {
        sendApplicationEmail(emailParams, submitBtn, messageDiv, form);
    }
}

function sendApplicationEmail(emailParams, submitBtn, messageDiv, form) {
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_APPLICATION_TEMPLATE_ID', {
        ...emailParams,
        to_email: 'hr.sparkgames@gmail.com'
    }).then(() => {
        messageDiv.className = 'text-center py-4 text-spark-cyan';
        messageDiv.innerHTML = '<i class="fas fa-check-circle mr-2"></i>Application submitted successfully! We\'ll review your application and get back to you soon.';
        messageDiv.classList.remove('hidden');
        submitBtn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>Submit Application';
        submitBtn.disabled = false;
        setTimeout(() => {
            closeApplicationModal();
        }, 3000);
    }, (error) => {
        messageDiv.className = 'text-center py-4 text-red-500';
        messageDiv.innerHTML = '<i class="fas fa-times-circle mr-2"></i>Failed to submit application. Please try again later.';
        messageDiv.classList.remove('hidden');
        submitBtn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>Submit Application';
        submitBtn.disabled = false;
    });
}



// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('applicationModal');
    if (event.target === modal) {
        closeApplicationModal();
    }
});

// Close modal with escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('applicationModal');
        if (!modal.classList.contains('hidden')) {
            closeApplicationModal();
        }
    }
});

// Export functions for external use if needed
window.SparkGames = {
    scrollToSection,
    showNotification,
    toggleMobileMenu,
    openApplicationModal,
    closeApplicationModal
};

console.log('⚡ Spark Games - Ready to ignite gaming adventures!');
