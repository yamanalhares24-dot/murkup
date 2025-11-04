const API_URL = 'https://dummyjson.com/products?limit=4';
const container = document.getElementById('productContainer');
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function showLoading() {
  container.innerHTML = '<div class="col-span-full text-center py-8"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div><p class="mt-2 text-gray-600">Loading...</p></div>';
}

showLoading();

fetch(API_URL)
  .then(res => res.json())
  .then(data => {
    renderProducts(data.products);
    updateCartCount();
  })
  .catch(err => {
    console.error('Error fetching:', err);
    container.innerHTML = '<div class="col-span-full text-center py-8 text-red-600">Error loading products</div>';
  });

function renderProducts(products) {
  container.innerHTML = '';
  
  products.forEach(product => {
    const card = document.createElement('div');
    card.className =
      'w-full max-w-xs mx-auto overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 card-hover';

    card.innerHTML = `
      <div class="flex justify-center items-center bg-gray-100 h-64 cursor-pointer" onclick="window.location.href='details.html?id=${product.id}'">
        <img class="object-contain w-full h-full p-4" src="${product.thumbnail}" alt="${product.title}">
      </div>
      <div class="py-5 text-center px-4">
        <h3 class="block text-lg font-bold text-gray-800 dark:text-white mb-1 truncate cursor-pointer" onclick="window.location.href='details.html?id=${product.id}'">${product.title}</h3>
        <span class="text-sm text-gray-700 dark:text-gray-200 block mb-2">$${product.price}</span>
        <div class="flex gap-2 justify-center">
          <button onclick="window.location.href='details.html?id=${product.id}'" class="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition text-sm">View Details</button>
          <button onclick="event.stopPropagation(); addToCart(${product.id})" class="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition text-sm">Add to Cart</button>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

window.addToCart = function(productId) {
  fetch(`https://dummyjson.com/products/${productId}`)
    .then(res => res.json())
    .then(product => {
      cart.push(product);
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50 transform translate-x-full transition-transform';
      toast.textContent = 'Product added to cart!';
      document.body.appendChild(toast);
      
      setTimeout(() => toast.classList.remove('translate-x-full'), 100);
      setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => document.body.removeChild(toast), 300);
      }, 2000);
    })
    .catch(err => console.error('Error adding to cart:', err));
}

function updateCartCount() {
  const cartCountElement = document.getElementById('navCartCount');
  if (cartCountElement) {
    cartCountElement.textContent = cart.length;
    cartCountElement.style.display = 'flex';
  }
}

setTimeout(updateCartCount, 100);
setTimeout(updateCartCount, 500);
setTimeout(updateCartCount, 1000);