document.addEventListener('DOMContentLoaded', () => {
  // --- AOS (Animate on Scroll) Initialization ---
  AOS.init({
    duration: 800, // values from 0 to 3000, with step 50ms
    easing: 'ease-in-out', // default easing for AOS animations
    once: true, // whether animation should happen only once - while scrolling down
    mirror: false, // whether elements should animate out while scrolling past them
  });

  // --- Sticky Header & Active Nav Link Highlighting ---
  const header = document.getElementById('main-header');
  const navLinks = document.querySelectorAll('#main-nav a');
  const sections = document.querySelectorAll('section[id]');

  const handleScroll = () => {
    // Handle sticky header
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Handle active nav link highlighting
    let currentSection = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 100) {
        // Adjusted offset
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href').substring(1) === currentSection) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check

  // --- Mobile Navigation Toggle ---
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');

  menuToggle.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    menuToggle.setAttribute(
      'aria-expanded',
      mainNav.classList.contains('active')
    );
  });

  // Close mobile nav when a link is clicked
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (mainNav.classList.contains('active')) {
        mainNav.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      // Close other active items
      faqItems.forEach((otherItem) => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-answer').style.maxHeight = null;
        }
      });

      // Toggle current item
      item.classList.toggle('active');
      if (item.classList.contains('active')) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        answer.style.maxHeight = null;
      }
    });
  });

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
      const selectedFlavor = flavorSelect.value;
      const basePrice = prices[selectedFlavor];
      const quantity = parseInt(quantityInput.value, 10) || 1;

      // "Both" option implies 2 jars, so quantity selector acts as a multiplier.
      // e.g., Qty 2 of "Both" = 2 * (1 of each) = 4 jars total.
      const total = basePrice * quantity;

      totalPriceEl.textContent = `RM ${total.toFixed(2)}`;
    };

    flavorSelect.addEventListener('change', () => {
      // When the user selects "Both", reset the quantity to 1
      if (flavorSelect.value === 'Both (1 of each)') {
        quantityInput.value = 1;
      }
      updatePrice();
    });

    quantityInput.addEventListener('input', updatePrice);

    decreaseQtyBtn.addEventListener('click', () => {
      let currentQty = parseInt(quantityInput.value, 10);
      if (currentQty > 1) {
        quantityInput.value = currentQty - 1;
        updatePrice();
      }
    });

    increaseQtyBtn.addEventListener('click', () => {
      let currentQty = parseInt(quantityInput.value, 10);
      quantityInput.value = currentQty + 1;
      updatePrice();
    });

    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const flavor = flavorSelect.value;
      const quantity = quantityInput.value;
      const total = totalPriceEl.textContent;

      const phoneNumber = '60174092591'; // Your WhatsApp number
      let message;

      if (flavor === 'Both (1 of each)') {
        message = `Hi Chocolicious! I'd like to order *${quantity}x set of Both Flavors* (Total: ${total}).`;
      } else {
        message = `Hi Chocolicious! I'd like to order *${quantity}x ${flavor} Chocojar* (Total: ${total}).`;
      }

      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        message
      )}`;

      window.open(whatsappUrl, '_blank');
    });

    // Initial price calculation
    updatePrice();
  }
});
