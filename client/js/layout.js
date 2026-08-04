// Inject sidebar + topbar into any admin page
// Usage: AdminLayout.render('Dashboard')
const AdminLayout = {
  render: (pageTitle) => {
    const sidebarHTML = `
      <div class="sidebar-overlay" id="sidebarOverlay"></div>
      <aside class="sidebar" id="sidebar">
        <a href="dashboard.html" class="sidebar-brand">
          <div class="brand-icon"><i class="bi bi-credit-card-2-front"></i></div>
          <span>Smart<br>Business Card</span>
        </a>
        <nav class="sidebar-nav">
          <div class="nav-section-label">Main</div>
          <a href="dashboard.html" class="sidebar-link">
            <i class="bi bi-speedometer2"></i> Dashboard
          </a>
          <a href="customers.html" class="sidebar-link">
            <i class="bi bi-people"></i> Customers
          </a>
          <a href="analytics.html" class="sidebar-link">
            <i class="bi bi-bar-chart-line"></i> Analytics
          </a>
          <a href="settings.html" class="sidebar-link">
            <i class="bi bi-gear"></i> Settings
          </a>
        </nav>
        <div class="sidebar-footer">
          <button onclick="Auth.logout()" class="sidebar-link w-100 border-0 text-start"
            style="background:none;cursor:pointer;">
            <i class="bi bi-box-arrow-left"></i> Logout
          </button>
        </div>
      </aside>

      <div class="main-content">
        <header class="topbar">
          <button class="btn btn-sm me-3 d-md-none" id="sidebarToggle" style="border:none;background:none;font-size:1.2rem;">
            <i class="bi bi-list"></i>
          </button>
          <span class="topbar-title">${pageTitle}</span>
          <div class="ms-auto topbar-admin">
            <div class="admin-avatar" id="adminAvatar">A</div>
            <span id="adminName" class="d-none d-sm-inline">Admin</span>
          </div>
        </header>
        <div class="page-content" id="pageContent">
    `;

    const closingHTML = `
        </div><!-- /page-content -->
      </div><!-- /main-content -->
    `;

    document.body.insertAdjacentHTML('afterbegin', sidebarHTML);
    document.body.insertAdjacentHTML('beforeend', closingHTML);

    // Toast container
    document.body.insertAdjacentHTML('beforeend',
      `<div class="toast-container position-fixed bottom-0 end-0 p-3" id="toastContainer"></div>`
    );

    initSidebar();
  },
};
