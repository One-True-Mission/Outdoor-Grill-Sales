/* ============================================================
   OUTDOOR GRILL SALES — script.js
   Page-specific interactions (forms, filters, catalog)
   ============================================================ */

/* ─────────────────────────────────────────────
   CONTACT FORM SUBMISSION (Formspree)
   Replace YOUR_FORM_ID with Michael's Formspree ID
   Sign up free at formspree.io
   ───────────────────────────────────────────── */
const FORMSPREE_ID = 'YOUR_FORM_ID';

function initContactForm() {
  const form = document.getElementById('appointment-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const submitBtn = form.querySelector('.form-submit');
    const successMsg = document.getElementById('form-success');

    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    })
      .then(response => {
        if (response.ok) {
          form.style.display = 'none';
          if (successMsg) successMsg.classList.add('show');
        } else {
          submitBtn.textContent = 'Send Request';
          submitBtn.disabled = false;
          alert('Something went wrong. Please call us at 817-550-6038 or email michael@outdoorgrillsales.com');
        }
      })
      .catch(() => {
        submitBtn.textContent = 'Send Request';
        submitBtn.disabled = false;
        alert('Something went wrong. Please call us at 817-550-6038 or email michael@outdoorgrillsales.com');
      });
  });
}

/* ─────────────────────────────────────────────
   CATALOG CATEGORY FILTER
   Filters product sections by category tag
   ───────────────────────────────────────────── */
function initCatalogFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const categories = document.querySelectorAll('.catalog-category');

  if (!filterBtns.length || !categories.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.filter;

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Show/hide categories
      categories.forEach(cat => {
        if (target === 'all' || cat.dataset.category === target) {
          cat.style.display = 'block';
        } else {
          cat.style.display = 'none';
        }
      });

      // Scroll to top of catalog
      const catalogSection = document.getElementById('catalog-start');
      if (catalogSection) {
        catalogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ─────────────────────────────────────────────
   PRODUCT CARD "CALL FOR PRICING" LINK
   Pre-fills the contact form with product interest
   ───────────────────────────────────────────── */
function initProductCTA() {
  document.querySelectorAll('.product-cta[data-product]').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const product = this.dataset.product || '';
      const category = this.dataset.category || '';

      // Store interest in sessionStorage to pre-fill form on contact page
      sessionStorage.setItem('ogs_product_interest', product);
      sessionStorage.setItem('ogs_category_interest', category);

      // Navigate to contact page
      window.location.href = 'contact.html?interest=' + encodeURIComponent(product);
    });
  });
}

/* ─────────────────────────────────────────────
   PRE-FILL FORM FROM URL PARAMS
   Runs on contact.html if arriving from a product CTA
   ───────────────────────────────────────────── */
function initFormPrefill() {
  const params = new URLSearchParams(window.location.search);
  const interest = params.get('interest') || sessionStorage.getItem('ogs_product_interest');
  const category = params.get('category') || sessionStorage.getItem('ogs_category_interest');

  if (interest) {
    const notesField = document.getElementById('field-notes');
    if (notesField && notesField.value === '') {
      notesField.value = `I am interested in: ${interest}`;
    }
  }

  if (category) {
    const categoryField = document.getElementById('field-category');
    if (categoryField) {
      const options = Array.from(categoryField.options);
      const match = options.find(o => o.value.toLowerCase().includes(category.toLowerCase()));
      if (match) categoryField.value = match.value;
    }
  }
}

/* ─────────────────────────────────────────────
   ANIMATED COUNTERS (homepage stats)
   ───────────────────────────────────────────── */
function animateCounter(el, target, suffix, duration) {
  let start = null;
  const step = (ts) => {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const val = Math.floor(ease * target);
    el.textContent = val + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target + suffix;
  };
  requestAnimationFrame(step);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const duration = parseInt(el.dataset.duration) || 1600;
        animateCounter(el, target, suffix, duration);
        io.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => io.observe(el));
}

/* ─────────────────────────────────────────────
   BRAND PAGE - FILTER BY TYPE
   ───────────────────────────────────────────── */
function initBrandFilter() {
  const filterBtns = document.querySelectorAll('.brand-filter-btn');
  const brandCards = document.querySelectorAll('.brand-card');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      brandCards.forEach(card => {
        if (target === 'all' || card.dataset.type === target) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ─────────────────────────────────────────────
   INIT ALL ON DOM READY
   ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  initCatalogFilter();
  initProductCTA();
  initFormPrefill();
  initCounters();
  initBrandFilter();
});
