document.addEventListener('DOMContentLoaded', () => {
  redirectIfAuthed();

  const form = document.getElementById('loginForm');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearAlert('formAlert');
    clearFieldErrors(['emailError', 'passwordError']);

    const email = form.email.value.trim();
    const password = form.password.value;

    let valid = true;
    if (!validateEmail(email)) {
      setFieldError('emailError', 'Enter a valid email address');
      valid = false;
    }
    if (!password) {
      setFieldError('passwordError', 'Password is required');
      valid = false;
    }
    if (!valid) return;

    try {
      const data = await apiRequest('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setAuth(data.token, data.user);
      window.location.href = '/dashboard.html';
    } catch (error) {
      showAlert('formAlert', error.message);
    }
  });
});
