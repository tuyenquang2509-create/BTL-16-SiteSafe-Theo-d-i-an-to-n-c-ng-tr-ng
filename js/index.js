/* SiteSafe · Đăng nhập/đăng ký */
// Demo login gate: client-side only; this is not production authentication.
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  const loginScreen = document.getElementById('loginScreen');
  const appShell = document.getElementById('appShell');
  const loginError = document.getElementById('loginError');
  const togglePassword = document.getElementById('togglePassword');
  const loginView = document.getElementById('loginView');
  const registerView = document.getElementById('registerView');
  const registerForm = document.getElementById('registerForm');
  const registerMessage = document.getElementById('registerMessage');
  const confirmPassword = document.getElementById('confirmPassword');
  const confirmPasswordError = document.getElementById('confirmPasswordError');
  const showLogin = () => {
    registerView.hidden = true;
    loginView.hidden = false;
    loginError.textContent = '';
  };
  const showRegister = () => {
    loginView.hidden = true;
    registerView.hidden = false;
    registerMessage.textContent = '';
    registerMessage.className = 'auth-message';
  };
  const showApp = () => { loginScreen.style.display = 'none'; appShell.style.display = 'flex'; };
  document.getElementById('showRegister').addEventListener('click', showRegister);
  document.getElementById('showLogin').addEventListener('click', showLogin);
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    if (!email || password.length < 4) { loginError.textContent = 'Email hoặc mật khẩu không chính xác. Kiểm tra lại hoặc đặt lại mật khẩu. Không xóa email đã nhập.'; return; }
    currentRole = 'safety';
    currentPage = roleConfig[currentRole].pages[0][0];
    sessionStorage.setItem('sitesafe-demo-session', JSON.stringify({email, role: currentRole}));
    loginError.textContent = '';
    renderPage();
    showApp();
  });
  document.getElementById('forgotPassword')?.addEventListener('click', (event) => { event.preventDefault(); loginError.textContent = 'Bản demo chưa gửi email đặt lại mật khẩu. Vui lòng liên hệ quản trị viên.'; });
  togglePassword?.addEventListener('click', () => {
    const input = document.getElementById('loginPassword');
    input.type = input.type === 'password' ? 'text' : 'password';
    togglePassword.setAttribute('aria-label', input.type === 'password' ? 'Hiện mật khẩu' : 'Ẩn mật khẩu');
    togglePassword.setAttribute('aria-pressed', String(input.type === 'text'));
  });
  registerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (confirmPassword.value !== document.getElementById('registerPassword').value) {
      confirmPassword.setCustomValidity('Mật khẩu xác nhận chưa khớp.');
      confirmPasswordError.hidden = false;
      confirmPassword.focus();
      return;
    }
    confirmPassword.setCustomValidity('');
    confirmPasswordError.hidden = true;
    registerMessage.className = 'auth-message is-success';
    registerMessage.textContent = 'Đã nhận hồ sơ. Tài khoản đang chờ quản trị viên xác minh; bạn chưa có quyền truy cập dữ liệu công trường.';
  });
  confirmPassword.addEventListener('input', () => {
    confirmPassword.setCustomValidity('');
    confirmPasswordError.hidden = true;
    if (registerMessage.classList.contains('is-success')) {
      registerMessage.textContent = '';
      registerMessage.className = 'auth-message';
    }
  });
  document.getElementById('logoutButton')?.addEventListener('click', () => {
    sessionStorage.removeItem('sitesafe-demo-session');
    loginForm.reset();
    registerForm.reset();
    showLogin();
    loginError.textContent = '';
    appShell.style.display = 'none';
    loginScreen.style.display = 'flex';
  });
}

document.addEventListener('submit', (event) => {
  const form = event.target;
  if (form.id === 'profileInfoForm') {
    const values = Object.fromEntries(new FormData(form).entries());
    profileData = {...profileData, name:String(values.name).trim(), email:String(values.email).trim(), phone:String(values.phone).trim()};
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profileData));
      profileSaved = true;
      renderPage();
    } catch (error) {
      console.error('Unable to save profile details.', error);
      toast('Không thể lưu hồ sơ trong bộ nhớ trình duyệt.');
    }
  } else if (form.id === 'profileNotificationsForm') {
    const values = new FormData(form);
    profileData.notifications = Object.fromEntries(['risk','actions','inspections','ai','app','email'].map(key => [key, values.has(key)]));
    profileData.notifications.digest = String(values.get('digest'));
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profileData));
      profileSaved = true;
      renderPage();
    } catch (error) {
      console.error('Unable to save notification preferences.', error);
      toast('Không thể lưu tùy chọn trong bộ nhớ trình duyệt.');
    }
  } else if (form.id === 'profilePasswordForm') {
    const current = $('#currentPassword').value;
    const password = $('#newPassword').value;
    const confirmation = $('#confirmNewPassword');
    if (password !== confirmation.value) {
      confirmation.setCustomValidity('Mật khẩu xác nhận không khớp.');
      confirmation.reportValidity();
      return;
    }
    confirmation.setCustomValidity('');
    $('#passwordFeedback').textContent = current === password
      ? 'Mật khẩu mới phải khác mật khẩu hiện tại.'
      : 'Bản demo chưa kết nối xác thực. Mật khẩu chưa được thay đổi.';
    form.reset();
  }
}, true);

document.addEventListener('input', (event) => {
  if (event.target.id === 'confirmNewPassword') event.target.setCustomValidity('');
});

document.addEventListener('change', (event) => {
  if (event.target.id !== 'profilePhoto') return;
  const file = event.target.files[0];
  if (!file) return;
  if (!['image/jpeg','image/png'].includes(file.type) || file.size > 2 * 1024 * 1024) {
    event.target.value = '';
    toast('Chọn ảnh JPG hoặc PNG có dung lượng tối đa 2 MB.');
    return;
  }
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    if (typeof reader.result !== 'string') {
      toast('Không thể đọc ảnh đã chọn.');
      return;
    }
    profilePhotoUrl = reader.result;
    profileData.photo = profilePhotoUrl;
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profileData));
      profileSaved = true;
      renderPage();
    } catch (error) {
      console.error('Unable to save profile photo.', error);
      profilePhotoUrl = '';
      delete profileData.photo;
      event.target.value = '';
      toast('Không thể lưu ảnh trong bộ nhớ trình duyệt.');
    }
  });
  reader.addEventListener('error', () => toast('Không thể đọc ảnh đã chọn.'));
  reader.readAsDataURL(file);
});

document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action="profile-photo-delete"]');
  if (!button) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  const previousPhoto = profileData.photo;
  profilePhotoUrl = '';
  delete profileData.photo;
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profileData));
    profileSaved = true;
    renderPage();
  } catch (error) {
    console.error('Unable to remove profile photo.', error);
    profileData.photo = previousPhoto;
    profilePhotoUrl = typeof previousPhoto === 'string' ? previousPhoto : '';
    toast('Không thể xóa ảnh khỏi bộ nhớ trình duyệt.');
  }
});
