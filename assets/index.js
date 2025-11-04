const API_URL = 'https://dummyjson.com/products?limit=0';
const container = document.getElementById('productContainer');
const categorySelect = document.getElementById('categorySelect');
let allProducts = [];
let currentProducts = [];
let currentPage = 1;
const itemsPerPage = 8;
let cart = JSON.parse(localStorage.getItem('cart')) || [];

fetch(API_URL)
  .then(res => res.json())
  .then(data => {
    allProducts = data.products;
    renderProducts(allProducts);
    renderCategories();
    updateCartCount();
  })
  .catch(err => console.error('Error fetching:', err));

function renderProducts(products) {
  currentProducts = products;
  currentPage = 1;
  displayCurrentPage();
  renderPagination();
}

function displayCurrentPage() {
  container.innerHTML = '';
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const productsToShow = currentProducts.slice(startIndex, endIndex);

  productsToShow.forEach(product => {
    const card = document.createElement('div');
    card.className = 'w-full max-w-xs mx-auto overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 card-hover';

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

function renderCategories() {
  const categories = [...new Set(allProducts.map(p => p.category))];
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

categorySelect.addEventListener('change', (e) => {
  if (e.target.value === 'all') {
    renderProducts(allProducts);
  } else {
    filterProductsByCategory(e.target.value);
  }
});

function filterProductsByCategory(category) {
  const filtered = allProducts.filter(p => p.category === category);
  renderProducts(filtered);
}

document.getElementById('filterBtn').addEventListener('click', () => {
  const maxPrice = parseFloat(document.getElementById('priceFilter').value);
  if (isNaN(maxPrice)) {
    renderProducts(allProducts);
    return;
  }
  const filtered = allProducts.filter(p => p.price <= maxPrice);
  renderProducts(filtered);
});

function renderPagination() {
  const totalPages = Math.ceil(currentProducts.length / itemsPerPage);
  const pageNumbers = document.getElementById('pageNumbers');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  pageNumbers.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.className = `px-3 py-2 rounded ${i === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`;
    pageBtn.textContent = i;
    pageBtn.addEventListener('click', () => {
      currentPage = i;
      displayCurrentPage();
      renderPagination();
    });
    pageNumbers.appendChild(pageBtn);
  }

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;

  prevBtn.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      displayCurrentPage();
      renderPagination();
    }
  };

  nextBtn.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      displayCurrentPage();
      renderPagination();
    }
  };
}

window.addToCart = function(productId) {
  const product = allProducts.find(p => p.id === productId);
  if (product) {
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
  }
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