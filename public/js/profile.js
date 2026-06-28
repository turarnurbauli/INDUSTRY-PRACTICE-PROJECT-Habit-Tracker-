document.addEventListener('DOMContentLoaded', async () => {
  requireAuth();

  try {
    const data = await apiRequest('/profile');
    const user = data.user;

    document.getElementById('profileName').textContent = user.name;
    document.getElementById('profileEmail').textContent = user.email;
    document.getElementById('profilePhone').textContent = user.phone || 'Not provided';
    document.getElementById('profileCreated').textContent = new Date(user.createdAt).toLocaleDateString();
    document.getElementById('profileHabits').textContent = user.stats.totalHabits;
    document.getElementById('profileLogs').textContent = user.stats.totalLogs;
  } catch (error) {
    showAlert('profileAlert', error.message);
  }
});
