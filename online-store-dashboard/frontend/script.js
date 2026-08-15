const API_URL = 'http://localhost:3000/api/products';

const productBody = document.getElementById('productBody');
const addProductBtn = document.getElementById('addProductBtn');
const searchInput = document.getElementById('searchInput');
const productModal = document.getElementById('productModal');
const modalTitle = document.getElementById('modalTitle');
const productForm = document.getElementById('productForm');
const cancelBtn = document.getElementById('cancelBtn');

let editingId = null;
let allProducts = [];

// Fetch all products and render
async function fetchProducts() {
  try {
    const res = await fetch(API_URL);
    allProducts = await res.json();
    renderProducts(allProducts);
  } catch (err) {
    console.error('Products fetch karne me error:', err);
  }
}

// Render products table
function renderProducts(products) {
  productBody.innerHTML = '';

  if (products.length === 0) {
    productBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:30px;">Koi product nahi mila</td></tr>';
    return;
  }

  products.forEach(product => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td>Rs. ${product.price}</td>
      <td>${product.stock}</td>
      <td>${product.category}</td>
      <td>
        <div class="actions-cell">
          <button class="btn btn-edit" onclick="editProduct(${product.id})">Edit</button>
          <button class="btn btn-delete" onclick="deleteProduct(${product.id})">Delete</button>
        </div>
      </td>
    `;
    productBody.appendChild(row);
  });
}

// Show modal for add
function openAddModal() {
  editingId = null;
  modalTitle.textContent = 'Add Product';
  productForm.reset();
  productModal.classList.remove('hidden');
}

// Show modal for edit
function editProduct(id) {
  const product = allProducts.find(p => p.id === id);
  if (!product) return;

  editingId = id;
  modalTitle.textContent = 'Edit Product';
  document.getElementById('name').value = product.name;
  document.getElementById('price').value = product.price;
  document.getElementById('stock').value = product.stock;
  document.getElementById('category').value = product.category;
  productModal.classList.remove('hidden');
}

// Close modal
function closeModal() {
  productModal.classList.add('hidden');
  productForm.reset();
  editingId = null;
}

// Add or Update product
async function saveProduct(e) {
  e.preventDefault();

  const productData = {
    name: document.getElementById('name').value,
    price: parseFloat(document.getElementById('price').value),
    stock: parseInt(document.getElementById('stock').value),
    category: document.getElementById('category').value
  };

  try {
    if (editingId) {
      await fetch(`${API_URL}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
    } else {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
    }

    closeModal();
    fetchProducts();
  } catch (err) {
    console.error('Product save karne me error:', err);
  }
}

// Delete product
async function deleteProduct(id) {
  if (!confirm(`Kya aap product ID ${id} delete karna chahte hain?`)) return;

  try {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchProducts();
  } catch (err) {
    console.error('Product delete karne me error:', err);
  }
}

// Search products
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  const filtered = allProducts.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query)
  );
  renderProducts(filtered);
});

// Event listeners
addProductBtn.addEventListener('click', openAddModal);
cancelBtn.addEventListener('click', closeModal);
productModal.addEventListener('click', (e) => {
  if (e.target === productModal) closeModal();
});
productForm.addEventListener('submit', saveProduct);

// Initial load
fetchProducts();