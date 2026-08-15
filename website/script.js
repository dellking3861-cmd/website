// =============================================
// NOVATECH SOLUTIONS - Vanilla JavaScript
// No frameworks. Pure vanilla JS only.
// =============================================

// =============================================
// SUPABASE CLIENT INITIALIZATION
// =============================================
const supabaseUrl = 'https://hzyanwsmbzlbdasykfno.supabase.co';
const supabaseKey = 'sb_publishable_3D22vwin8oF5TEoN1wqQiw__8oEL-dP';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// =============================================
// 1. MOBILE MENU TOGGLE
// =============================================
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Close mobile menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.nav-links').classList.remove('active');
    });
});

// =============================================
// 2. PORTFOLIO FILTERING
// =============================================
function filterPortfolio(category) {
    const items = document.querySelectorAll('.portfolio-item');
    const buttons = document.querySelectorAll('.filter-btn');

    // Update active button
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Filter items with animation
    items.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'block';
            // Re-trigger animation
            item.classList.remove('animate-fade-slide');
            void item.offsetWidth; // force reflow
            item.classList.add('animate-fade-slide');
        } else {
            item.style.display = 'none';
        }
    });
}

// =============================================
// 3. CONTACT FORM SUBMISSION (SUPABASE)
// =============================================
async function handleSubmit(event) {
    event.preventDefault();

    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('formSuccess');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;

    // Disable button while submitting
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
        // Insert message into Supabase contact_messages table
        const { error } = await supabase
            .from('contact_messages')
            .insert({
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                subject: document.getElementById('subject').value.trim(),
                message: document.getElementById('message').value.trim()
            });

        if (error) throw error;

        // Success - show success message
        form.style.display = 'none';
        successMessage.style.display = 'block';
    } catch (err) {
        console.error('Error submitting form:', err);
        alert('Sorry, there was an error sending your message. Please try again.');
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
    }
}

// =============================================
// 4. LOAD PORTFOLIO PROJECTS FROM SUPABASE
// =============================================
async function loadPortfolioProjects() {
    const portfolioGrid = document.querySelector('.portfolio-grid');
    if (!portfolioGrid) return;

    try {
        const { data, error } = await supabase
            .from('portfolio_projects')
            .select('*')
            .eq('is_published', true)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // If no data in Supabase, keep existing static HTML
        if (!data || data.length === 0) return;

        // Clear existing static items and render from Supabase
        portfolioGrid.innerHTML = '';

        data.forEach(project => {
            const tags = Array.isArray(project.tags) ? project.tags : [];
            const tagLabel = tags.length > 0 ? tags.join(', ') : project.category.charAt(0).toUpperCase() + project.category.slice(1);

            const item = document.createElement('div');
            item.className = 'portfolio-item';
            item.dataset.category = project.category;
            item.innerHTML = `
                <div class="portfolio-image">${project.image_url ? `<img src="${project.image_url}" alt="${project.title}" style="width:100%;height:100%;object-fit:cover;">` : '📸'}</div>
                <div class="portfolio-info">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <span class="portfolio-tag">${tagLabel}</span>
                </div>
            `;
            portfolioGrid.appendChild(item);
        });

        // Re-observe new items for scroll animations
        const newItems = portfolioGrid.querySelectorAll('.portfolio-item');
        newItems.forEach(el => observer.observe(el));
    } catch (err) {
        console.error('Error loading portfolio:', err);
    }
}

// =============================================
// 5. LOAD TESTIMONIALS FROM SUPABASE
// =============================================
async function loadTestimonials() {
    const testimonialGrid = document.querySelector('.testimonial-grid');
    if (!testimonialGrid) return;

    try {
        const { data, error } = await supabase
            .from('testimonials')
            .select('*')
            .eq('is_published', true)
            .order('created_at', { ascending: true });

        if (error) throw error;

        // If no data in Supabase, keep existing static HTML
        if (!data || data.length === 0) return;

        // Clear existing static testimonials and render from Supabase
        testimonialGrid.innerHTML = '';

        data.forEach(testimonial => {
            const card = document.createElement('div');
            card.className = 'testimonial-card';
            card.innerHTML = `
                <p>"${testimonial.quote}"</p>
                <div class="testimonial-author">
                    <strong>${testimonial.client_name}</strong>
                    ${testimonial.client_role ? `<span>${testimonial.client_role}</span>` : ''}
                </div>
            `;
            testimonialGrid.appendChild(card);
        });

        // Re-observe new items for scroll animations
        const newCards = testimonialGrid.querySelectorAll('.testimonial-card');
        newCards.forEach(el => observer.observe(el));
    } catch (err) {
        console.error('Error loading testimonials:', err);
    }
}

// =============================================
// 6. LOAD TEAM MEMBERS FROM SUPABASE
// =============================================
async function loadTeamMembers() {
    const teamGrid = document.querySelector('.team-grid');
    if (!teamGrid) return;

    try {
        const { data, error } = await supabase
            .from('team_members')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true });

        if (error) throw error;

        // If no data in Supabase, keep existing static HTML
        if (!data || data.length === 0) return;

        // Clear existing static team and render from Supabase
        teamGrid.innerHTML = '';

        data.forEach(member => {
            const card = document.createElement('div');
            card.className = 'team-card';
            card.innerHTML = `
                <div class="team-avatar">${member.avatar_url ? `<img src="${member.avatar_url}" alt="${member.name}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">` : '👨‍💻'}</div>
                <h3>${member.name}</h3>
                <p class="team-role">${member.role}</p>
                ${member.bio ? `<p>${member.bio}</p>` : ''}
            `;
            teamGrid.appendChild(card);
        });

        // Re-observe new items for scroll animations
        const newCards = teamGrid.querySelectorAll('.team-card');
        newCards.forEach(el => observer.observe(el));
    } catch (err) {
        console.error('Error loading team members:', err);
    }
}

// =============================================
// 7. SMOOTH SCROLL FOR ANCHOR LINKS
// =============================================
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

// =============================================
// 8. STICKY NAVBAR SHADOW ON SCROLL
// =============================================
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
});

// =============================================
// 9. SCROLL ANIMATIONS - SLIDE UP & FADE IN
//    Uses IntersectionObserver for performance
//    No jQuery, no libraries, pure vanilla JS.
// =============================================

// Elements to animate on scroll
const animatedElements = document.querySelectorAll(
    '.feature-card, .service-card, .pricing-card, ' +
    '.portfolio-item, .team-card, .stat-card, ' +
    '.testimonial-card, .about-text h2, .about-text p, ' +
    '.contact-detail, .form-group'
);

// Create IntersectionObserver
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Add staggered delay based on element index
            const delay = Math.min(index * 100, 600);
            entry.target.style.transitionDelay = delay + 'ms';
            entry.target.classList.add('animate-fade-slide');
            // Stop observing once animated
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
});

// Observe all animation targets
animatedElements.forEach(el => observer.observe(el));

// Also animate hero elements on page load
window.addEventListener('load', () => {
    const heroElements = document.querySelectorAll('.hero h1, .hero p, .hero .btn');
    heroElements.forEach((el, i) => {
        setTimeout(() => {
            el.style.transitionDelay = (i * 200) + 'ms';
            el.classList.add('animate-fade-slide');
        }, 300);
    });
});

// Animate page-header on interior pages
window.addEventListener('load', () => {
    const pageHeaders = document.querySelectorAll('.page-header h1, .page-header p');
    pageHeaders.forEach((el, i) => {
        setTimeout(() => {
            el.style.transitionDelay = (i * 200) + 'ms';
            el.classList.add('animate-fade-slide');
        }, 200);
    });
});

// =============================================
// 10. INIT - LOAD DATA FROM SUPABASE ON PAGE LOAD
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    loadPortfolioProjects();
    loadTestimonials();
    loadTeamMembers();
});