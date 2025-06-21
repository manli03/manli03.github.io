document.addEventListener('DOMContentLoaded', () => {
  // --- AOS (Animate on Scroll) Initialization ---
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false,
  });

  // --- Element Selections ---
  const header = document.getElementById('main-header');
  const toTopBtn = document.getElementById('back-to-top-btn');
  const body = document.body;

  // --- Scroll Handler for multiple features ---
  const handleScroll = () => {
    const scrollY = window.scrollY;

    // Find the hero section on the current page
    const heroSection = document.querySelector('#hero, .page-hero');
    let heroHeight = 0;
    if (heroSection) {
      heroHeight = heroSection.offsetHeight;
    }
    const headerHeight = header.offsetHeight;

    // --- 3-State Header Logic ---
    // State 1: At the very top (transparent)
    if (scrollY <= 50) {
      header.classList.remove(
        'scrolled',
        'semi-transparent-primary',
        'semi-transparent-secondary'
      );
    }
    // State 2: Scrolled into the hero (semi-transparent)
    else if (
      heroSection &&
      scrollY > 50 &&
      scrollY < heroHeight - headerHeight
    ) {
      header.classList.remove('scrolled');
      if (body.classList.contains('homepage')) {
        header.classList.add('semi-transparent-primary');
      } else if (body.classList.contains('project-page')) {
        header.classList.add('semi-transparent-secondary');
      }
    }
    // State 3: Scrolled past the hero (solid white)
    else {
      header.classList.remove(
        'semi-transparent-primary',
        'semi-transparent-secondary'
      );
      header.classList.add('scrolled');
    }

    // --- Back to Top button visibility ---
    if (scrollY > 400) {
      toTopBtn.classList.add('visible');
    } else {
      toTopBtn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check on page load

  // --- Back to Top Button Click (Universal) ---
  toTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });

  // --- Mobile Navigation Toggle ---
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');
  menuToggle.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    menuToggle.setAttribute(
      'aria-expanded',
      mainNav.classList.contains('active')
    );
    if (mainNav.classList.contains('active')) {
      header.classList.add('scrolled');
    } else if (window.scrollY <= 50) {
      header.classList.remove('scrolled');
    }
  });

  const navLinks = document.querySelectorAll('#main-nav a');
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (mainNav.classList.contains('active')) {
        mainNav.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        if (window.scrollY <= 50) {
          header.classList.remove('scrolled');
        }
      }
    });
  });

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length > 0) {
    faqItems.forEach((item) => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      question.addEventListener('click', () => {
        faqItems.forEach((otherItem) => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
            otherItem.querySelector('.faq-answer').style.maxHeight = null;
          }
        });
        item.classList.toggle('active');
        answer.style.maxHeight = item.classList.contains('active')
          ? answer.scrollHeight + 'px'
          : null;
      });
    });
  }

  // --- Interactive Order Form ---
  const orderForm = document.getElementById('chocojar-order-form');
  if (orderForm) {
    const flavorSelect = document.getElementById('flavor');
    const quantityInput = document.getElementById('quantity');
    const decreaseQtyBtn = document.getElementById('decrease-qty');
    const increaseQtyBtn = document.getElementById('increase-qty');
    const totalPriceEl = document.getElementById('total-price');
    const prices = {
      'Classic Chocolate': 6,
      'White Chocolate': 6,
      'Both (1 of each)': 12,
    };
    const updatePrice = () => {
      const total =
        prices[flavorSelect.value] * (parseInt(quantityInput.value, 10) || 1);
      totalPriceEl.textContent = `RM ${total.toFixed(2)}`;
    };
    flavorSelect.addEventListener('change', () => {
      if (flavorSelect.value === 'Both (1 of each)') quantityInput.value = 1;
      updatePrice();
    });
    quantityInput.addEventListener('input', updatePrice);
    decreaseQtyBtn.addEventListener('click', () => {
      if (parseInt(quantityInput.value, 10) > 1) {
        quantityInput.value = parseInt(quantityInput.value, 10) - 1;
        updatePrice();
      }
    });
    increaseQtyBtn.addEventListener('click', () => {
      quantityInput.value = parseInt(quantityInput.value, 10) + 1;
      updatePrice();
    });
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const flavor = flavorSelect.value;
      const quantity = quantityInput.value;
      const total = totalPriceEl.textContent;
      const phoneNumber = '60174092591';
      let message =
        flavor === 'Both (1 of each)'
          ? `Hi Chocolicious! I'd like to order *${quantity}x set of Both Flavors* (Total: ${total}).`
          : `Hi Chocolicious! I'd like to order *${quantity}x ${flavor} Chocojar* (Total: ${total}).`;
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        message
      )}`;
      window.open(whatsappUrl, '_blank');
    });
    updatePrice();
  }

  // --- Lightbox Functionality ---
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');

    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('lightbox-trigger')) {
        lightboxImg.src = e.target.src;
        lightbox.classList.add('visible');
      }
    });

    const closeLightbox = () => {
      lightbox.classList.remove('visible');
    };

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }
});
