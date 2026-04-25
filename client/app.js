const API = 'http://localhost:3000/api';

let allServices = [];
let selectedService = null;

// ---- PAGE NAVIGATION ----
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
  document.getElementById(name).classList.remove('hidden');
  if (name === 'services') loadServices();
  if (name === 'dashboard') loadDashboard();
}

// ---- LOAD ALL SERVICES ----
async function loadServices() {
  const res = await fetch(`${API}/services`);
  allServices = await res.json();
  renderCards(allServices);
}

// ---- RENDER CARDS ----
function renderCards(list) {
  const container = document.getElementById('cards');
  container.innerHTML = '';
  list.forEach(s => {
    const card = document.createElement('div');
    card.className = 'card';
    card.draggable = true;
    card.dataset.id = s.id;
    card.innerHTML = `
      <h3>${s.title}</h3>
      <span class="tag">${s.category}</span>
      <span class="price">$${s.price}</span>
      <span class="rating">⭐ ${s.rating}</span>
      <small>by ${s.seller}</small>
    `;
    card.onclick = () => openModal(s);
    card.ondragstart = (e) => e.dataTransfer.setData('id', s.id);
    container.appendChild(card);
  });
}

// ---- SEARCH / FILTER / SORT ----
function applyFilters() {
  const search = document.getElementById('search').value.toLowerCase();
  const category = document.getElementById('category').value;
  const sort = document.getElementById('sort').value;

  let list = allServices.filter(s => {
    const matchSearch = s.title.toLowerCase().includes(search);
    const matchCategory = category === '' || s.category === category;
    return matchSearch && matchCategory;
  });

  if (sort === 'price-low') list.sort((a, b) => a.price - b.price);
  if (sort === 'price-high') list.sort((a, b) => b.price - a.price);
  if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);

  renderCards(list);
}

// ---- DRAG & DROP ----
function onDrop(e) {
  e.preventDefault();
  const id = e.dataTransfer.getData('id');
  saveService(parseInt(id));
  document.getElementById('dropzone').textContent = '✅ Service Saved via Drag & Drop!';
  setTimeout(() => {
    document.getElementById('dropzone').textContent = 'Drop a service card here to Save it';
  }, 2000);
}

// ---- MODAL ----
function openModal(service) {
  selectedService = service;
  document.getElementById('modal-content').innerHTML = `
    <h3>${service.title}</h3>
    <span class="tag">${service.category}</span>
    <p style="margin-top:10px">${service.description}</p>
    <p><strong>Price:</strong> $${service.price}</p>
    <p><strong>Rating:</strong> ⭐ ${service.rating}</p>
    <p><strong>Seller:</strong> ${service.seller}</p>
  `;
  document.getElementById('save-btn').onclick = () => saveService(service.id);
  document.getElementById('hire-btn').onclick = () => hireService(service.id);
  document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
  selectedService = null;
}

// ---- SAVE SERVICE ----
async function saveService(id) {
  const res = await fetch(`${API}/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });
  const data = await res.json();
  alert(data.message || 'Saved!');
  closeModal();
}

// ---- HIRE SERVICE ----
async function hireService(id) {
  const res = await fetch(`${API}/hire`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });
  const data = await res.json();
  alert(data.message || 'Hired!');
  closeModal();
}

// ---- LOAD DASHBOARD ----
async function loadDashboard() {
  const savedRes = await fetch(`${API}/saved`);
  const savedData = await savedRes.json();

  const hiredRes = await fetch(`${API}/hired`);
  const hiredData = await hiredRes.json();

  renderDashboardList('saved-list', savedData);
  renderDashboardList('hired-list', hiredData);
}

function renderDashboardList(containerId, list) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  if (list.length === 0) {
    container.innerHTML = '<p style="color:#888">Nothing here yet.</p>';
    return;
  }
  list.forEach(s => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${s.title}</h3>
      <span class="tag">${s.category}</span>
      <span class="price">$${s.price}</span>
      <span class="rating">⭐ ${s.rating}</span>
      <small>by ${s.seller}</small>
    `;
    container.appendChild(card);
  });
}

// ---- INIT ----
showPage('home');
