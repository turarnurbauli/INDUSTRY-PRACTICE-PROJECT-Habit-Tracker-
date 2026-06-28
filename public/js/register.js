document.addEventListener('DOMContentLoaded', () => {
  redirectIfAuthed();

  const form = document.getElementById('registerForm');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearAlert('formAlert');
    clearFieldErrors(['nameError', 'emailError', 'passwordError', 'phoneError']);

    const payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      password: form.password.value,
      phone: form.phone.value.trim(),
    };

    let valid = true;
    if (payload.name.length < 2) {
      setFieldError('nameError', 'Name must be at least 2 characters');
      valid = false;
    }
    if (!validateEmail(payload.email)) {
      setFieldError('emailError', 'Enter a valid email address');
      valid = false;
    }
    if (!validatePassword(payload.password)) {
      setFieldError(
        'passwordError',
        'Password must be 8+ chars with uppercase, lowercase, and number'
      );
      valid = false;
    }
    if (!validatePhone(payload.phone)) {
      setFieldError('phoneError', 'Enter a valid phone number or leave empty');
      valid = false;
    }
    if (!valid) return;

    try {
      const data = await apiRequest('/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setAuth(data.token, data.user);
      window.location.href = '/dashboard.html';
    } catch (error) {
      showAlert('formAlert', error.message);
    }
  });
});
