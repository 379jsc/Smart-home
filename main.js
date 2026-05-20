/* =============================================
   379 TDK – Main JavaScript
   ============================================= */

// ── LANGUAGE TOGGLE ──────────────────────────
let currentLang = localStorage.getItem('tdk_lang') || 'vi';

function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('tdk_lang', lang);
  const btn = document.getElementById('langBtn');
  if (btn) btn.textContent = lang === 'vi' ? 'EN' : 'VI';

  document.querySelectorAll('[data-vi][data-en]').forEach(el => {
    const text = el.getAttribute('data-' + lang);
    if (text) el.textContent = text;
  });

  // Update placeholders
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.placeholder = lang === 'vi' ? 'Tìm kiếm sản phẩm...' : 'Search products...';
  }
}

function toggleLang() {
  const next = currentLang === 'vi' ? 'en' : 'vi';
  applyLang(next);
}

// ── HEADER SCROLL ────────────────────────────
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const header = document.getElementById('header');
  if (header) {
    header.style.boxShadow = scrollY > 20
      ? '0 4px 20px rgba(15,76,129,.15)'
      : '';
  }

  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    scrollTopBtn.style.display = scrollY > 400 ? 'flex' : 'none';
  }
  lastScroll = scrollY;
});

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── MOBILE NAV ───────────────────────────────
function toggleNav() {
  const nav = document.getElementById('mainNav');
  if (nav) nav.classList.toggle('open');
}

// Close nav on outside click
document.addEventListener('click', (e) => {
  const nav = document.getElementById('mainNav');
  const toggle = document.querySelector('.menu-toggle');
  if (nav && toggle && !nav.contains(e.target) && !toggle.contains(e.target)) {
    nav.classList.remove('open');
  }
});

// ── CART ─────────────────────────────────────
let cartItems = JSON.parse(localStorage.getItem('tdk_cart') || '[]');

function saveCart() {
  localStorage.setItem('tdk_cart', JSON.stringify(cartItems));
}

function updateCartUI() {
  const badge = document.getElementById('cartBadge');
  const cartBody = document.getElementById('cartBody');
  const cartEmpty = document.getElementById('cartEmpty');
  const cartItemsEl = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');

  if (badge) badge.textContent = cartItems.length;

  if (cartItemsEl) {
    if (cartItems.length === 0) {
      if (cartEmpty) cartEmpty.style.display = 'flex';
      cartItemsEl.innerHTML = '';
    } else {
      if (cartEmpty) cartEmpty.style.display = 'none';
      cartItemsEl.innerHTML = cartItems.map((item, idx) => `
        <div class="cart-item">
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">${item.price}</div>
          </div>
          <button class="cart-item-remove" onclick="removeCartItem(${idx})">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      `).join('');
    }
  }
}

function addToCart(btn, name, price) {
  cartItems.push({ name, price, id: Date.now() });
  saveCart();
  updateCartUI();

  // Animate button
  const origHTML = btn.innerHTML;
  btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>${currentLang === 'vi' ? 'Đã thêm!' : 'Added!'}</span>`;
  btn.style.background = '#27ae60';
  btn.style.borderColor = '#27ae60';
  btn.style.color = 'white';
  setTimeout(() => {
    btn.innerHTML = origHTML;
    btn.style.background = '';
    btn.style.borderColor = '';
    btn.style.color = '';
    // Re-init lucide icons inside btn
    if (window.lucide) window.lucide.createIcons();
  }, 1800);

  showToast(currentLang === 'vi' ? `✓ Đã thêm "${name}" vào giỏ hàng` : `✓ "${name}" added to cart`);
}

function removeCartItem(idx) {
  cartItems.splice(idx, 1);
  saveCart();
  updateCartUI();
}

function toggleCart() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');
  if (sidebar && overlay) {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
    document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
  }
}

// ── PRODUCT FILTER ───────────────────────────
function filterProducts(cat) {
  const cards = document.querySelectorAll('.product-card');
  const tabs = document.querySelectorAll('.filter-tab');

  // Update tabs
  tabs.forEach(tab => {
    const tabCat = tab.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
    tab.classList.toggle('active', tabCat === cat);
  });

  // Filter cards
  cards.forEach(card => {
    const cardCat = card.getAttribute('data-cat');
    if (cat === 'all' || cardCat === cat) {
      card.classList.remove('hidden');
      card.style.animation = 'fadeInUp .4s ease forwards';
    } else {
      card.classList.add('hidden');
    }
  });

  // Scroll to products section if triggered from categories
  if (cat !== 'all') {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      setTimeout(() => {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }
}

// ── TOAST ────────────────────────────────────
let toastTimeout;
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 2800);
}

// ── COUNTDOWN ────────────────────────────────
function initCountdown() {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 7);
  endDate.setHours(23, 59, 59, 0);

  function update() {
    const now = new Date();
    const diff = endDate - now;
    if (diff <= 0) return;
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    const pad = n => String(n).padStart(2, '0');
    const cdDays = document.getElementById('cdDays');
    const cdHours = document.getElementById('cdHours');
    const cdMins = document.getElementById('cdMins');
    const cdSecs = document.getElementById('cdSecs');
    if (cdDays) cdDays.textContent = pad(days);
    if (cdHours) cdHours.textContent = pad(hours);
    if (cdMins) cdMins.textContent = pad(mins);
    if (cdSecs) cdSecs.textContent = pad(secs);
  }
  update();
  setInterval(update, 1000);
}

// ── CONTACT FORM ─────────────────────────────
function submitForm(btn) {
  const origText = btn.innerHTML;
  btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg><span>${currentLang === 'vi' ? 'Đang gửi...' : 'Sending...'}</span>`;
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>${currentLang === 'vi' ? 'Đã gửi thành công!' : 'Sent successfully!'}</span>`;
    btn.style.background = '#27ae60';
    btn.style.borderColor = '#27ae60';
    showToast(currentLang === 'vi' ? '✓ Yêu cầu đã được gửi! Chúng tôi sẽ liên hệ sớm.' : '✓ Request sent! We will contact you soon.');
    setTimeout(() => {
      btn.innerHTML = origText;
      btn.disabled = false;
      btn.style.background = '';
      btn.style.borderColor = '';
      if (window.lucide) window.lucide.createIcons();
    }, 3000);
  }, 1500);
}

// ── SEARCH ───────────────────────────────────
const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const q = searchInput.value.trim().toLowerCase();
      if (!q) return;
      const cards = document.querySelectorAll('.product-card');
      let found = 0;
      cards.forEach(card => {
        const name = card.querySelector('.product-name')?.textContent.toLowerCase() || '';
        const cat = card.querySelector('.product-cat')?.textContent.toLowerCase() || '';
        if (name.includes(q) || cat.includes(q)) {
          card.classList.remove('hidden');
          found++;
        } else {
          card.classList.add('hidden');
        }
      });
      // Reset tabs
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      const productsSection = document.getElementById('products');
      if (productsSection) productsSection.scrollIntoView({ behavior: 'smooth' });
      showToast(currentLang === 'vi' ? `Tìm thấy ${found} sản phẩm cho "${q}"` : `Found ${found} products for "${q}"`);
    }
  });
}

// ── INTERSECTION OBSERVER (scroll reveal) ────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

function initScrollReveal() {
  const els = document.querySelectorAll('.product-card, .cat-card, .testimonial-card, .contact-card, .feature-item');
  els.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity .5s ease ${(i % 4) * .1}s, transform .5s ease ${(i % 4) * .1}s`;
    revealObserver.observe(el);
  });
}

// ── INIT ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Apply saved language
  applyLang(currentLang);

  // Init Lucide icons
  if (window.lucide) window.lucide.createIcons();

  // Init cart UI
  updateCartUI();

  // Init countdown
  initCountdown();

  // Scroll reveal
  initScrollReveal();

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerH = document.getElementById('header')?.offsetHeight || 0;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH - 8;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
});
