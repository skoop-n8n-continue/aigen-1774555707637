/**
 * Fresh & Crisp Cafe - Digital Signage Controller
 * Automatically cycles featured items and manages animations.
 */

// Cache busting query parameter
const CACHE_BUST = 'v=frsh3';

// Featured items data
const features = [
  {
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop',
    title: 'Signature Harvest Bowl',
    desc: 'Organic kale, roasted sweet potato, quinoa, and our house-made citrus vinaigrette.'
  },
  {
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?q=80&w=1974&auto=format&fit=crop',
    title: 'Berry Antioxidant',
    desc: 'Mixed wild berries, açaí, banana, and freshly pressed almond milk.'
  },
  {
    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?q=80&w=2072&auto=format&fit=crop',
    title: 'Avocado Artisan Toast',
    desc: 'Smashed Hass avocado, micro-greens, radish, and chili flakes on fresh sourdough.'
  }
];

// Menu data
const menuData = [
  {
    category: 'Salads & Bowls',
    items: [
      { name: 'Harvest Bowl', price: '12.50', calories: '450', desc: 'Kale, sweet potato, quinoa, almonds' },
      { name: 'Citrus Summer Salad', price: '11.00', calories: '320', desc: 'Mixed greens, orange segments, feta, pecans' },
      { name: 'Protein Power Bowl', price: '13.50', calories: '680', desc: 'Brown rice, black beans, avocado, grilled chicken' }
    ]
  },
  {
    category: 'Smoothies & Juices',
    items: [
      { name: 'Berry Antioxidant', price: '7.50', calories: '210', desc: 'Açaí, blueberry, strawberry, almond milk' },
      { name: 'Green Detox', price: '8.00', calories: '140', desc: 'Spinach, cucumber, green apple, ginger, lemon' },
      { name: 'Tropical Sunrise', price: '7.00', calories: '190', desc: 'Mango, pineapple, coconut water, turmeric' }
    ]
  },
  {
    category: 'Artisan Toasts',
    items: [
      { name: 'Avocado Smush', price: '9.00', calories: '340', desc: 'Avocado, cherry tomatoes, balsamic glaze' },
      { name: 'Fig & Ricotta', price: '8.50', calories: '280', desc: 'Whipped ricotta, fresh figs, honey drizzle' },
      { name: 'Smoked Salmon', price: '10.50', calories: '420', desc: 'Cream cheese, capers, dill, red onion' }
    ]
  }
];

let currentFeatureIndex = 0;

// Render the static menu section
function renderMenu() {
  const container = document.getElementById('menu-categories');
  container.innerHTML = '';

  menuData.forEach((cat, index) => {
    // Container for the category
    const catDiv = document.createElement('div');
    catDiv.className = 'category';
    // Staggered fade in delay for a nice entrance
    catDiv.style.animationDelay = `${index * 0.4}s`;

    // Category Title
    const catTitle = document.createElement('h2');
    catTitle.className = 'category-title';
    catTitle.textContent = cat.category;
    catDiv.appendChild(catTitle);

    // Menu Items
    cat.items.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'menu-item';

      itemDiv.innerHTML = `
        <div class="item-row">
          <span class="item-name">${item.name}</span>
          <span class="item-dots"></span>
          <span class="item-price">
            $${item.price}
            <span class="item-calories">${item.calories} kcal</span>
          </span>
        </div>
        <div class="item-desc">${item.desc}</div>
      `;
      catDiv.appendChild(itemDiv);
    });

    container.appendChild(catDiv);
  });
}

// Update the featured image and text, handling the crossfade and ken burns
function cycleFeature() {
  const feature = features[currentFeatureIndex];
  const imageContainer = document.getElementById('image-container');
  const textOverlay = document.getElementById('text-overlay');

  // 1. Prepare new image layer
  const newLayer = document.createElement('div');
  newLayer.className = 'image-layer';

  const img = document.createElement('img');
  // Add cache bust param to image URL if it doesn't already have query params
  const sep = feature.image.includes('?') ? '&' : '?';
  img.src = `${feature.image}${sep}${CACHE_BUST}`;
  newLayer.appendChild(img);

  // Append new layer behind the active one (z-index is handled in CSS)
  imageContainer.appendChild(newLayer);

  // Force a browser reflow so the transition works
  void newLayer.offsetWidth;

  // 2. Fade out text
  textOverlay.style.opacity = '0';

  // 3. Update text & crossfade images slightly after text fade out starts
  setTimeout(() => {
    // Update the text content
    document.getElementById('featured-title').textContent = feature.title;
    document.getElementById('featured-desc').textContent = feature.desc;

    // Fade text back in
    textOverlay.style.opacity = '1';

    // Make the new layer active (fades in and starts ken burns)
    newLayer.classList.add('active');

    // Deactivate and remove old layers
    const layers = imageContainer.querySelectorAll('.image-layer');
    layers.forEach(layer => {
      if (layer !== newLayer) {
        layer.classList.remove('active');
        // Wait for CSS transition to finish before removing from DOM
        setTimeout(() => {
          if (layer.parentNode === imageContainer) {
            imageContainer.removeChild(layer);
          }
        }, 2000); // 2s matches CSS opacity transition
      }
    });
  }, 400); // 400ms delay to allow text to start fading out

  // Advance to next feature
  currentFeatureIndex = (currentFeatureIndex + 1) % features.length;
}

// Re-trigger menu animations periodically to keep the screen looking "alive"
function refreshMenuAnimations() {
  const cats = document.querySelectorAll('.category');
  cats.forEach(cat => {
    cat.style.animation = 'none';
    void cat.offsetWidth; // trigger reflow
    cat.style.animation = null;
  });
}

function init() {
  renderMenu();
  cycleFeature(); // Show first feature immediately

  // Set interval to cycle features every 15 seconds
  setInterval(cycleFeature, 15000);

  // Refresh menu animations every 2 minutes
  setInterval(refreshMenuAnimations, 120000);
}

// Run when DOM is ready
document.addEventListener('DOMContentLoaded', init);