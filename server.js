import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');
const DATA_DIR = path.join(__dirname, 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const DOLLS_FILE = path.join(DATA_DIR, 'dolls.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper to safely read JSON
function readJson(filePath, fallback = []) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return fallback;
}

// Helper to safely write JSON
function writeJson(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
    return false;
  }
}

// Simple request body parser
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.webp': 'image/webp'
};

const server = http.createServer(async (req, res) => {
  const [urlPath] = req.url.split('?');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  // ----------------------------------------------------------------
  // REST API ENDPOINTS
  // ----------------------------------------------------------------

  // 1. GET /api/products
  if (urlPath === '/api/products' && req.method === 'GET') {
    const products = readJson(PRODUCTS_FILE, null);
    return sendJson(res, 200, { products: products || [] });
  }

  // 2. POST /api/products (Add or Seed products)
  if (urlPath === '/api/products' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      if (Array.isArray(body)) {
        // Bulk save/seed
        writeJson(PRODUCTS_FILE, body);
        return sendJson(res, 200, { success: true, count: body.length });
      }
      const products = readJson(PRODUCTS_FILE, []);
      const newProduct = {
        ...body,
        id: body.id || `product-${Date.now()}`
      };
      products.unshift(newProduct);
      writeJson(PRODUCTS_FILE, products);
      return sendJson(res, 201, { success: true, product: newProduct });
    } catch (e) {
      return sendJson(res, 400, { error: 'Invalid product JSON' });
    }
  }

  // 3. PUT /api/products/:id (Update product price, inventory, specials)
  if (urlPath.startsWith('/api/products/') && req.method === 'PUT') {
    const id = decodeURIComponent(urlPath.replace('/api/products/', ''));
    try {
      const updates = await parseBody(req);
      const products = readJson(PRODUCTS_FILE, []);
      const idx = products.findIndex(p => p.id === id);
      if (idx === -1) {
        return sendJson(res, 404, { error: 'Product not found' });
      }
      products[idx] = { ...products[idx], ...updates };
      writeJson(PRODUCTS_FILE, products);
      return sendJson(res, 200, { success: true, product: products[idx] });
    } catch (e) {
      return sendJson(res, 400, { error: 'Invalid product update' });
    }
  }

  // 4. DELETE /api/products/:id (Delete product)
  if (urlPath.startsWith('/api/products/') && req.method === 'DELETE') {
    const id = decodeURIComponent(urlPath.replace('/api/products/', ''));
    const products = readJson(PRODUCTS_FILE, []);
    const filtered = products.filter(p => p.id !== id);
    writeJson(PRODUCTS_FILE, filtered);
    return sendJson(res, 200, { success: true, id });
  }

  // 5. GET /api/orders (List all orders for Hazel)
  if (urlPath === '/api/orders' && req.method === 'GET') {
    const orders = readJson(ORDERS_FILE, []);
    return sendJson(res, 200, { orders });
  }

  // 6. POST /api/orders (Submit new order from customer)
  if (urlPath === '/api/orders' && req.method === 'POST') {
    try {
      const orderData = await parseBody(req);
      const orders = readJson(ORDERS_FILE, []);
      const newOrder = {
        ...orderData,
        orderId: orderData.orderId || `HDM-${Math.floor(100000 + Math.random() * 900000)}`,
        status: orderData.status || 'pending_review',
        createdAt: Date.now()
      };
      orders.unshift(newOrder);
      writeJson(ORDERS_FILE, orders);

      // Decrement stock for inventory items if specified
      if (Array.isArray(orderData.items)) {
        const products = readJson(PRODUCTS_FILE, []);
        let updatedProducts = false;
        orderData.items.forEach(it => {
          const p = products.find(prod => prod.id === it.product.id);
          if (p && typeof p.stockCount === 'number') {
            p.stockCount = Math.max(0, p.stockCount - it.quantity);
            if (p.stockCount === 0) p.inStock = false;
            updatedProducts = true;
          }
        });
        if (updatedProducts) writeJson(PRODUCTS_FILE, products);
      }

      return sendJson(res, 201, { success: true, order: newOrder });
    } catch (e) {
      return sendJson(res, 400, { error: 'Failed to create order' });
    }
  }

  // 7. PUT /api/orders/:id/status (Update order status, e.g., discussing, confirmed, shipped)
  if (urlPath.startsWith('/api/orders/') && req.method === 'PUT') {
    const id = decodeURIComponent(urlPath.replace('/api/orders/', ''));
    try {
      const updates = await parseBody(req);
      const orders = readJson(ORDERS_FILE, []);
      const idx = orders.findIndex(o => o.orderId === id || o.id === id);
      if (idx === -1) {
        return sendJson(res, 404, { error: 'Order not found' });
      }
      orders[idx] = { ...orders[idx], ...updates };
      writeJson(ORDERS_FILE, orders);
      return sendJson(res, 200, { success: true, order: orders[idx] });
    } catch (e) {
      return sendJson(res, 400, { error: 'Failed to update order' });
    }
  }

  // 8. GET /api/dolls (List dolls)
  if (urlPath === '/api/dolls' && req.method === 'GET') {
    const dolls = readJson(DOLLS_FILE, null);
    return sendJson(res, 200, { dolls: dolls || [] });
  }

  // 9. POST /api/dolls (Add/Seed dolls)
  if (urlPath === '/api/dolls' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      if (Array.isArray(body)) {
        writeJson(DOLLS_FILE, body);
        return sendJson(res, 200, { success: true, count: body.length });
      }
      const dolls = readJson(DOLLS_FILE, []);
      const newDoll = { ...body, id: body.id || `doll-${Date.now()}` };
      dolls.unshift(newDoll);
      writeJson(DOLLS_FILE, dolls);
      return sendJson(res, 201, { success: true, doll: newDoll });
    } catch (e) {
      return sendJson(res, 400, { error: 'Invalid doll data' });
    }
  }

  // ----------------------------------------------------------------
  // STATIC ASSETS & SPA FALLBACK
  // ----------------------------------------------------------------
  let filePath = path.join(DIST_DIR, urlPath);

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable'
      });
      fs.createReadStream(filePath).pipe(res);
    } else {
      // SPA Fallback: serve index.html
      const indexPath = path.join(DIST_DIR, 'index.html');
      fs.readFile(indexPath, (readErr, content) => {
        if (readErr) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('500 Internal Server Error: Build files missing. Run npm run build first.');
          return;
        }
        res.writeHead(200, {
          'Content-Type': 'text/html; charset=UTF-8',
          'Cache-Control': 'no-cache'
        });
        res.end(content);
      });
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Hazel The Dollmaker full backend server running on http://0.0.0.0:${PORT}`);
});
