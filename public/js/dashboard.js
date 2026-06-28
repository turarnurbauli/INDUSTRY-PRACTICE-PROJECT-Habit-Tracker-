let editingHabitId = null;
let currentPage = 1;
let totalPages = 1;

function getFiltersFromForm() {
  return {
    search: document.getElementById('searchInput').value.trim(),
    frequency: document.getElementById('frequencyFilter').value,
    category: document.getElementById('categoryFilter').value,
    page: currentPage,
    limit: Number(document.getElementById('limitSelect').value) || 6,
  };
}

function applyFiltersToForm(filters) {
  document.getElementById('searchInput').value = filters.search || '';
  document.getElementById('frequencyFilter').value = filters.frequency || '';
  document.getElementById('categoryFilter').value = filters.category || '';
  document.getElementById('limitSelect').value = String(filters.limit || 6);
  currentPage = filters.page || 1;
}

function buildQuery(filters) {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.frequency) params.set('frequency', filters.frequency);
  if (filters.category) params.set('category', filters.category);
  params.set('page', String(filters.page));
  params.set('limit', String(filters.limit));
  return params.toString();
}

async function loadHabits() {
  const filters = getFiltersFromForm();
  saveFilters(filters);

  try {
    const data = await apiRequest(`/habits?${buildQuery(filters)}`);
    renderHabits(data.habits);
    renderPagination(data.pagination);
    updateStats(data.habits, data.pagination.total);
  } catch (error) {
    showAlert('dashboardAlert', error.message);
  }
}

function updateStats(habits, total) {
  document.getElementById('statTotal').textContent = total;
  document.getElementById('statCompleted').textContent = habits.filter((h) => h.completedToday).length;
  document.getElementById('statActive').textContent = habits.filter((h) => h.isActive).length;
  document.getElementById('statDaily').textContent = habits.filter((h) => h.frequency === 'daily').length;
}

function renderHabits(habits) {
  const container = document.getElementById('habitsContainer');
  if (!habits.length) {
    container.innerHTML =
      '<div class="empty-state"><h3>No habits found</h3><p>Create your first habit or change filters.</p></div>';
    return;
  }

  container.innerHTML = habits
    .map(
      (habit) => `
      <article class="habit-card">
        <div class="habit-top">
          <div style="display:flex;gap:0.75rem;flex:1;">
            <div class="habit-color" style="background:${habit.color}"></div>
            <div>
              <div class="habit-title">${escapeHtml(habit.title)}</div>
              <p style="color:var(--text-muted);font-size:0.92rem;">${escapeHtml(habit.description || 'No description')}</p>
            </div>
          </div>
        </div>
        <div class="habit-meta">
          <span class="badge">${habit.frequency}</span>
          <span class="badge">${habit.category}</span>
          ${habit.completedToday ? '<span class="badge badge-success">Done today</span>' : ''}
          ${!habit.isActive ? '<span class="badge">Inactive</span>' : ''}
        </div>
        <div class="habit-actions">
          <button class="btn btn-success btn-sm" data-action="complete" data-id="${habit._id}" ${habit.completedToday ? 'disabled' : ''}>Mark Done</button>
          <button class="btn btn-secondary btn-sm" data-action="edit" data-id="${habit._id}">Edit</button>
          <button class="btn btn-danger btn-sm" data-action="delete" data-id="${habit._id}">Delete</button>
        </div>
      </article>`
    )
    .join('');
}

function renderPagination(pagination) {
  currentPage = pagination.page;
  totalPages = pagination.totalPages;
  document.getElementById('pageInfo').textContent = `Page ${pagination.page} of ${pagination.totalPages}`;
  document.getElementById('prevPage').disabled = pagination.page <= 1;
  document.getElementById('nextPage').disabled = pagination.page >= pagination.totalPages;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function openModal(habit = null) {
  editingHabitId = habit ? habit._id : null;
  document.getElementById('modalTitle').textContent = habit ? 'Edit Habit' : 'Create Habit';
  document.getElementById('habitTitle').value = habit?.title || '';
  document.getElementById('habitDescription').value = habit?.description || '';
  document.getElementById('habitFrequency').value = habit?.frequency || 'daily';
  document.getElementById('habitCategory').value = habit?.category || 'other';
  document.getElementById('habitColor').value = habit?.color || '#4f46e5';
  document.getElementById('habitActive').checked = habit ? habit.isActive : true;
  document.getElementById('habitModal').classList.remove('hidden');
}

function closeModal() {
  editingHabitId = null;
  document.getElementById('habitModal').classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
  requireAuth();
  applyFiltersToForm(loadFilters());

  document.getElementById('createHabitBtn').addEventListener('click', () => openModal());
  document.getElementById('closeModalBtn').addEventListener('click', closeModal);
  document.getElementById('cancelModalBtn').addEventListener('click', closeModal);

  document.getElementById('applyFiltersBtn').addEventListener('click', () => {
    currentPage = 1;
    loadHabits();
  });

  document.getElementById('resetFiltersBtn').addEventListener('click', () => {
    applyFiltersToForm({ search: '', frequency: '', category: '', page: 1, limit: 6 });
    loadHabits();
  });

  document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage -= 1;
      loadHabits();
    }
  });

  document.getElementById('nextPage').addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage += 1;
      loadHabits();
    }
  });

  document.getElementById('habitForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const payload = {
      title: document.getElementById('habitTitle').value.trim(),
      description: document.getElementById('habitDescription').value.trim(),
      frequency: document.getElementById('habitFrequency').value,
      category: document.getElementById('habitCategory').value,
      color: document.getElementById('habitColor').value,
      isActive: document.getElementById('habitActive').checked,
    };

    if (payload.title.length < 2) {
      showAlert('dashboardAlert', 'Title must be at least 2 characters');
      return;
    }

    try {
      if (editingHabitId) {
        await apiRequest(`/habits/${editingHabitId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest('/habits', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      closeModal();
      loadHabits();
    } catch (error) {
      showAlert('dashboardAlert', error.message);
    }
  });

  document.getElementById('habitsContainer').addEventListener('click', async (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;

    const id = button.dataset.id;
    const action = button.dataset.action;

    if (action === 'delete') {
      if (!confirm('Delete this habit?')) return;
      try {
        await apiRequest(`/habits/${id}`, { method: 'DELETE' });
        loadHabits();
      } catch (error) {
        showAlert('dashboardAlert', error.message);
      }
    }

    if (action === 'edit') {
      try {
        const filters = getFiltersFromForm();
        const data = await apiRequest(`/habits?${buildQuery({ ...filters, page: 1, limit: 50 })}`);
        const habit = data.habits.find((item) => item._id === id);
        if (habit) openModal(habit);
      } catch (error) {
        showAlert('dashboardAlert', error.message);
      }
    }

    if (action === 'complete') {
      try {
        await apiRequest(`/habits/${id}/log`, {
          method: 'POST',
          body: JSON.stringify({ completedDate: new Date().toISOString(), status: 'completed' }),
        });
        loadHabits();
      } catch (error) {
        showAlert('dashboardAlert', error.message);
      }
    }
  });

  loadHabits();
});
