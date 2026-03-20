// ================= CART SYSTEM =================
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// ================= LOGIN CHECK =================
function isLoggedIn() {
  return localStorage.getItem("userLoggedIn") === "true";
}

function requireLogin() {
  showToast("Please login first 🔐");
  setTimeout(() => {
    window.location.href = "login.html";
  }, 1500);
}

// ================= TOAST (GLASS UI) =================
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "glass-toast";
  toast.innerText = message;

  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 100);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ================= CART COUNT =================
function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = totalItems;
  });
}

// ================= SAVE CART =================
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

// ================= ADD TO CART =================
function addToCart(productId, name, price, image = '') {

  if (!isLoggedIn()) {
    requireLogin();
    return;
  }

  if (!productId || !name || !price) {
    console.error('Missing product data');
    return;
  }

  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, name, price, image, quantity: 1 });
  }

  saveCart();
  showToast(`${name} added to cart 🛒`);
}

// ================= REMOVE ITEM =================
function removeItem(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  if (typeof renderCart === 'function') renderCart();
}

// ================= UPDATE QUANTITY =================
function updateQuantity(productId, change) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    removeItem(productId);
  } else {
    saveCart();
    if (typeof renderCart === 'function') renderCart();
  }
}

// ================= CLEAR CART =================
function clearCart() {
  if (confirm('Remove all items from cart?')) {
    cart = [];
    saveCart();
    if (typeof renderCart === 'function') renderCart();
  }
}

// ================= LOGOUT =================
function logout() {
  localStorage.removeItem("userLoggedIn");
  showToast("Logged out 👋");
}

// ================= MOBILE MENU =================
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();

  document.querySelector('.mobile-toggle')?.addEventListener('click', () => {
    document.querySelector('.nav-links')?.classList.toggle('active');
  });
});