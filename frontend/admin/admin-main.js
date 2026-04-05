/* =========================================
   C&O GROUP | MASTER COMMAND CENTER ENGINE
   Handles: Security Shield, Multi-Vault Auth, 
   Global UI Sync & Auto-Logout Protocols
========================================= */

// ==========================================
// 1. GLOBAL AUTHENTICATION SHIELD
// ==========================================
// Automatically kicks unauthenticated users out before the page even finishes loading
(function checkAuth() {
    const token = localStorage.getItem('adminToken');
    const isLoginPage = window.location.href.toLowerCase().includes('index.html') || window.location.href.toLowerCase().includes('login.html');
    
    if (!token && !isLoginPage) {
        window.location.href = 'index.html'; // Adjust to your login file name
    }
})();

// ==========================================
// 2. THE SECURE FETCH ENGINE (Interceptor)
// ==========================================
// A globally available fetch wrapper that automatically attaches the JWT token
// and handles expired sessions smoothly across all pages.
window.secureFetch = async function(url, options = {}) {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = 'index.html';
        throw new Error("Access Denied: No Security Token.");
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...(options.headers || {})
    };

    const response = await fetch(url, { ...options, headers });
    
    if (response.status === 401 || response.status === 403) {
        console.warn("C&O SYSTEM: Security Session Expired. Re-authenticating...");
        localStorage.removeItem('adminToken');
        window.location.href = 'index.html';
        throw new Error("Unauthorized");
    }
    
    return response;
};

// ==========================================
// 3. GLOBAL UI SYNCHRONIZATION
// ==========================================
// Syncs the Admin Profile (Name and Avatar) across all pages from Settings
document.addEventListener('DOMContentLoaded', () => {
    applyGlobalSettings();
});

function applyGlobalSettings() {
    // 1. Apply Display Name
    const savedName = localStorage.getItem('adminDisplayName') || 'Principal Architect';
    const nameElements = document.querySelectorAll('#navAdminName');
    nameElements.forEach(el => el.innerText = savedName);

    // 2. Apply Initials to Avatar
    const navAvatar = document.getElementById('navAvatar');
    if (navAvatar) {
        const words = savedName.trim().split(' ');
        let initials = "AD";
        if (words.length > 1) {
            initials = (words[0][0] + words[1][0]).toUpperCase();
        } else if (words.length === 1 && words[0].length > 0) {
            initials = words[0].substring(0, 2).toUpperCase();
        }
        navAvatar.innerText = initials;
    }
}

// ==========================================
// 4. INACTIVITY AUTO-LOGOUT (Security Measure)
// ==========================================
// Protects the terminal if the admin walks away from their desk
(function() {
    // Skip idle timer if sitting on the login page
    if(window.location.href.toLowerCase().includes('index.html')) return;

    let inactivityTimer;
    const timeLimit = 30 * 60 * 1000; // 30 minutes in milliseconds

    function resetTimer() {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(logoutDueToInactivity, timeLimit);
    }

    function logoutDueToInactivity() {
        localStorage.removeItem('adminToken');
        alert("Session Expired due to 30 minutes of inactivity. Secure Terminal closed.");
        window.location.href = 'index.html';
    }

    // Listen for any human activity to reset the timer
    window.onload = resetTimer;
    document.onmousemove = resetTimer;
    document.onkeypress = resetTimer;
    document.onclick = resetTimer;
    document.ontouchstart = resetTimer;
})();


// ==========================================
// 5. UNIVERSAL MOBILE UI INJECTOR
// ==========================================
// Automatically builds the mobile hamburger menu and overlay for all admin pages
document.addEventListener('DOMContentLoaded', () => {
    // 1. Create and inject the dark overlay
    const overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    document.body.appendChild(overlay);

    // 2. Find the top navbar and inject the Hamburger button
    const topNav = document.querySelector('.top-navbar');
    if (topNav) {
        const hamburger = document.createElement('div');
        hamburger.className = 'mobile-menu-toggle';
        hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>';
        topNav.insertBefore(hamburger, topNav.firstChild);

        const sidebar = document.querySelector('.sidebar');

        // Toggle logic
        hamburger.addEventListener('click', () => {
            sidebar.classList.toggle('active-mobile');
            overlay.classList.toggle('active');
        });

        // Click outside to close
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('active-mobile');
            overlay.classList.remove('active');
        });

        // Auto-close when clicking a navigation link
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('active-mobile');
                    overlay.classList.remove('active');
                }
            });
        });
    }
});