const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.static('client'));
app.use(cors());
app.use(express.json());

// Serve the client folder as static files
app.use(express.static(path.join(__dirname, '../client')));

// --- DATA (stored in memory) ---
let services = [
  { id: 1, title: "Logo Design", category: "Design", price: 50, rating: 4.8, seller: "Ali", description: "I will design a professional logo for your brand." },
  { id: 2, title: "Build a Website", category: "Web Dev", price: 200, rating: 4.9, seller: "Sara", description: "I will build a responsive website using HTML, CSS and JS." },
  { id: 3, title: "Write Blog Posts", category: "Writing", price: 30, rating: 4.5, seller: "Usman", description: "I will write SEO-friendly blog posts for your website." },
  { id: 4, title: "Social Media Management", category: "Marketing", price: 80, rating: 4.6, seller: "Hina", description: "I will manage your social media accounts for a month." },
  { id: 5, title: "Video Editing", category: "Video", price: 60, rating: 4.7, seller: "Kamran", description: "I will edit your videos professionally." },
  { id: 6, title: "SEO Optimization", category: "Marketing", price: 100, rating: 4.4, seller: "Nadia", description: "I will improve your website ranking on Google." },
];

let saved = [];
let hired = [];

// --- API ROUTES ---

// Get all services
app.get('/api/services', (req, res) => {
  res.status(200).json(services);
});

// Get single service
app.get('/api/services/:id', (req, res) => {
  const service = services.find(s => s.id === parseInt(req.params.id));
  if (!service) return res.status(404).json({ error: 'Service not found' });
  res.status(200).json(service);
});

// Add new service (bonus)
app.post('/api/services', (req, res) => {
  const { title, category, price, rating, seller, description } = req.body;
  if (!title || !category || !price) {
    return res.status(400).json({ error: 'title, category and price are required' });
  }
  const newService = { id: services.length + 1, title, category, price, rating: rating || 5, seller: seller || 'Anonymous', description: description || '' };
  services.push(newService);
  res.status(201).json(newService);
});

// Save a service
app.post('/api/save', (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: 'id is required' });
  const service = services.find(s => s.id === parseInt(id));
  if (!service) return res.status(404).json({ error: 'Service not found' });
  if (!saved.find(s => s.id === service.id)) saved.push(service);
  res.status(200).json({ message: 'Saved!', service });
});

// Hire a service
app.post('/api/hire', (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: 'id is required' });
  const service = services.find(s => s.id === parseInt(id));
  if (!service) return res.status(404).json({ error: 'Service not found' });
  if (!hired.find(s => s.id === service.id)) hired.push(service);
  res.status(200).json({ message: 'Hired!', service });
});

// Get saved services
app.get('/api/saved', (req, res) => {
  res.status(200).json(saved);
});

// Get hired services
app.get('/api/hired', (req, res) => {
  res.status(200).json(hired);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
