'use strict';

/* -------------------------------------------------------
   NAVBAR — scroll shadow + active link
------------------------------------------------------- */
const navbar  = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav__link[data-section]');
const sections = document.querySelectorAll('main section[id], header[id]');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    highlightActiveSection();
}, { passive: true });

function highlightActiveSection() {
    let current = '';
    sections.forEach(sec => {
        const top = sec.getBoundingClientRect().top;
        if (top <= 100) current = sec.id;
    });
    navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.section === current);
    });
}

/* -------------------------------------------------------
   SMOOTH SCROLL para todos los links internos
------------------------------------------------------- */
document.querySelectorAll('a[href^="#"], .nav__link[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        closeMobileMenu();
        const offset = parseInt(getComputedStyle(document.documentElement)
            .getPropertyValue('--nav-h')) || 64;
        const top = target.getBoundingClientRect().top + window.scrollY - offset - 16;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

/* -------------------------------------------------------
   MENÚ MÓVIL (hamburger)
------------------------------------------------------- */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
    mobileMenu.setAttribute('aria-hidden', !open);
    mobileMenu.classList.toggle('open', open);
});

function closeMobileMenu() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
    mobileMenu.setAttribute('aria-hidden', true);
    mobileMenu.classList.remove('open');
}

/* -------------------------------------------------------
   SCROLL REVEAL (IntersectionObserver)
------------------------------------------------------- */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        // escalonar la aparición de elementos hermanos
        const siblings = [...entry.target.parentElement.children];
        const delay = siblings.indexOf(entry.target) * 60;
        setTimeout(() => {
            entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
    });
}, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* -------------------------------------------------------
   FILTRO DE HABILIDADES
------------------------------------------------------- */
const filterButtons = document.querySelectorAll('.filter-btn');
const skillCards    = document.querySelectorAll('.skill-card');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        skillCards.forEach((card, i) => {
            const match = filter === 'all' || card.dataset.category === filter;
            if (match) {
                card.classList.remove('hidden');
                // re-animar visualmente la aparición
                card.style.animationDelay = `${i * 40}ms`;
                void card.offsetWidth; // reflow
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

/* -------------------------------------------------------
   COPIAR AL PORTAPAPELES (email)
------------------------------------------------------- */
const toast = document.getElementById('toast');
let toastTimer;

document.querySelectorAll('.contact-copy').forEach(btn => {
    btn.addEventListener('click', () => {
        const value = btn.dataset.value;
        navigator.clipboard.writeText(value).then(() => {
            showToast('Copiado al portapapeles ✓');
        }).catch(() => {
            // Fallback para navegadores sin permiso
            const tmp = document.createElement('textarea');
            tmp.value = value;
            tmp.style.position = 'fixed';
            tmp.style.opacity = '0';
            document.body.appendChild(tmp);
            tmp.select();
            document.execCommand('copy');
            document.body.removeChild(tmp);
            showToast('Copiado al portapapeles ✓');
        });
    });
});

function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

/* -------------------------------------------------------
   ANIMACIÓN DEL AVATAR EN HERO (parallax suave)
------------------------------------------------------- */
const heroAvatar = document.querySelector('.hero__avatar');
window.addEventListener('scroll', () => {
    if (!heroAvatar) return;
    const scrolled = window.scrollY;
    heroAvatar.style.transform = `translateY(${scrolled * 0.08}px)`;
}, { passive: true });

/* -------------------------------------------------------
   HIGHLIGHT de stats al hacer hover en hero
------------------------------------------------------- */
document.querySelectorAll('.hero__stat').forEach(stat => {
    stat.addEventListener('mouseenter', () => {
        stat.querySelector('strong').style.color = '#fff';
    });
    stat.addEventListener('mouseleave', () => {
        stat.querySelector('strong').style.color = '';
    });
});

/* -------------------------------------------------------
   CERRAR menú al hacer click fuera
------------------------------------------------------- */
document.addEventListener('click', e => {
    if (!navbar.contains(e.target)) closeMobileMenu();
});

/* -------------------------------------------------------
   INIT
------------------------------------------------------- */
highlightActiveSection();
