// ── Auth helpers ──
const Auth = {
  getToken: () => localStorage.getItem('token'),
  getAdmin: () => JSON.parse(localStorage.getItem('admin') || 'null'),
  logout: async () => {
    try {
      await API.post('/api/auth/logout');
    } catch (_) {}
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    window.location.href = '/pages/login.html';
  },
  require: () => {
    if (!localStorage.getItem('token')) {
      window.location.href = '/pages/login.html';
    }
  },
};

// ── API helpers ──
const API = {
  headers: () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${Auth.getToken()}`,
  }),

  get: async (url) => {
    const res = await fetch(url, { headers: API.headers() });
    const data = await res.json();
    if (res.status === 401) { Auth.logout(); return; }
    return data;
  },

  post: async (url, body) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: API.headers(),
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (res.status === 401) { Auth.logout(); return; }
    return data;
  },

  put: async (url, body) => {
    const res = await fetch(url, {
      method: 'PUT',
      headers: API.headers(),
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (res.status === 401) { Auth.logout(); return; }
    return data;
  },

  delete: async (url) => {
    const res = await fetch(url, { method: 'DELETE', headers: API.headers() });
    const data = await res.json();
    if (res.status === 401) { Auth.logout(); return; }
    return data;
  },

  postForm: async (url, formData) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${Auth.getToken()}` },
      body: formData,
    });
    const data = await res.json();
    if (res.status === 401) { Auth.logout(); return; }
    return data;
  },

  putForm: async (url, formData) => {
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${Auth.getToken()}` },
      body: formData,
    });
    const data = await res.json();
    if (res.status === 401) { Auth.logout(); return; }
    return data;
  },
};

// ── Toast notifications ──
const Toast = {
  show: (message, type = 'success') => {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const id = `toast-${Date.now()}`;
    const icons = { success: 'check-circle-fill', danger: 'x-circle-fill', warning: 'exclamation-triangle-fill', info: 'info-circle-fill' };
    const html = `
      <div id="${id}" class="toast align-items-center text-bg-${type} border-0 mb-2" role="alert">
        <div class="d-flex">
          <div class="toast-body d-flex align-items-center gap-2">
            <i class="bi bi-${icons[type] || 'info-circle-fill'}"></i>
            ${message}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
      </div>`;
    container.insertAdjacentHTML('beforeend', html);
    const el = document.getElementById(id);
    const toast = new bootstrap.Toast(el, { delay: 3500 });
    toast.show();
    el.addEventListener('hidden.bs.toast', () => el.remove());
  },
};

// ── Format helpers ──
const Format = {
  date: (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  },
  datetime: (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  },
  initials: (name) => {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  },
};

// ── Sidebar toggle (mobile) ──
function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const toggleBtn = document.getElementById('sidebarToggle');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('show');
    });
  }
  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
    });
  }

  // Set active link
  const currentPage = window.location.pathname.split('/').pop();
  document.querySelectorAll('.sidebar-link').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

  // Set admin name
  const admin = Auth.getAdmin();
  if (admin) {
    const nameEl = document.getElementById('adminName');
    const avatarEl = document.getElementById('adminAvatar');
    if (nameEl) nameEl.textContent = admin.username;
    if (avatarEl) avatarEl.textContent = admin.username[0].toUpperCase();
  }
}
