const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const PRODUCTS_FILE = path.join(__dirname, 'products.json');

app.use(express.json());

// CORS middleware (frontend se API calls allow karne ke liye)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Helper functions
function readProducts() {
  const data = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
  return JSON.parse(data);
}

function writeProducts(products) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to Online Store API!');
});

// GET /api/products - all products
app.get('/api/products', (req, res) => {
  const products = readProducts();
  res.status(200).json(products);
});

// GET /api/products/:id - single product
app.get('/api/products/:id', (req, res) => {
  const products = readProducts();
  const product = products.find(p => p.id === parseInt(req.params.id));

  if (!product) {
    return res.status(404).json({ message: 'Product nahi mila' });
  }

  res.status(200).json(product);
});

// POST /api/products - add new product
app.post('/api/products', (req, res) => {
  const products = readProducts();
  const { name, price, stock, category } = req.body;

  const newProduct = {
    id: products.length ? products[products.length - 1].id + 1 : 1,
    name,
    price,
    stock,
    category
  };

  products.push(newProduct);
  writeProducts(products);

  res.status(201).json(newProduct);
});

// PUT /api/products/:id - update product
app.put('/api/products/:id', (req, res) => {
  const products = readProducts();
  const index = products.findIndex(p => p.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ message: 'Product nahi mila' });
  }

  const { name, price, stock, category } = req.body;
  products[index] = { ...products[index], name, price, stock, category };
  writeProducts(products);

  res.status(200).json(products[index]);
});

// DELETE /api/products/:id - delete product
app.delete('/api/products/:id', (req, res) => {
  const products = readProducts();
  const index = products.findIndex(p => p.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ message: 'Product nahi mila' });
  }

  const deleted = products.splice(index, 1);
  writeProducts(products);

  res.status(200).json(deleted[0]);
});

app.listen(PORT, () => {
  console.log('Server chal raha hai: http://localhost:3000');
});