const STORAGE_KEYS = {
  token: 'ht_token',
  user: 'ht_user',
  theme: 'ht_theme',
  filters: 'ht_filters',
};

const API_BASE = '/api';

function getToken() {
  return localStorage.getItem(STORAGE_KEYS.token);
}

function setAuth(token, user) {
  localStorage.setItem(STORAGE_KEYS.token, token);
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
}

function clearAuth() {
  localStorage.removeItem(STORAGE_KEYS.token);
  localStorage.removeItem(STORAGE_KEYS.user);
}

function getStoredUser() {
  const raw = localStorage.getItem(STORAGE_KEYS.user);
  return raw ? JSON.parse(raw) : null;
}

function applyTheme() {
  const saved = localStorage.getItem(STORAGE_KEYS.theme) || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  const toggle = document.getElementById('themeToggle');
  if (toggle) toggle.textContent = saved === 'dark' ? 'Light Mode' : 'Dark Mode';
}

function toggleTheme() {
  const current = localStorage.getItem(STORAGE_KEYS.theme) || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem(STORAGE_KEYS.theme, next);
  applyTheme();
}

function saveFilters(filters) {
  localStorage.setItem(STORAGE_KEYS.filters, JSON.stringify(filters));
}

function loadFilters() {
  const raw = localStorage.getItem(STORAGE_KEYS.filters);
  return raw ? JSON.parse(raw) : { search: '', frequency: '', category: '', page: 1, limit: 6 };
}

function requireAuth() {
  if (!getToken()) {
    window.location.href = '/login.html';
  }
}

function redirectIfAuthed() {
  if (getToken()) {
    window.location.href = '/dashboard.html';
  }
}

function updateNavbar() {
  const authed = Boolean(getToken());
  document.querySelectorAll('[data-auth="guest"]').forEach((el) => {
    el.classList.toggle('hidden', authed);
  });
  document.querySelectorAll('[data-auth="user"]').forEach((el) => {
    el.classList.toggle('hidden', !authed);
  });
}

async function apiRequest(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.message || 'Request failed';
    const details = data.errors?.map((e) => e.message).join(', ');
    throw new Error(details || message);
  }

  return data;
}

function showAlert(containerId, message, type = 'error') {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
}

function clearAlert(containerId) {
  const container = document.getElementById(containerId);
  if (container) container.innerHTML = '';
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}

function validatePhone(phone) {
  if (!phone) return true;
  return /^\+?[0-9\s\-()]{7,20}$/.test(phone);
}

function setFieldError(fieldId, message) {
  const el = document.getElementById(fieldId);
  if (el) el.textContent = message;
}

function clearFieldErrors(ids) {
  ids.forEach((id) => setFieldError(id, ''));
}

document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  updateNavbar();

  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      clearAuth();
      window.location.href = '/login.html';
    });
  }
});
