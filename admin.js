document.addEventListener('DOMContentLoaded', function() {
    // ── Supabase Setup ──
    const SUPABASE_URL = 'https://tjhtplbngkyziktmdmer.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqaHRwbGJuZ2t5emlrdG1kbWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2NzgyNzgsImV4cCI6MjA5OTI1NDI3OH0.vptfim9HXQur1y89XZHUuOc7uH0pcvZj8HH8XHyk520';
    
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Elements
    const loginSection = document.getElementById('login-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const reviewsList = document.getElementById('admin-reviews-list');
    const logoutBtn = document.getElementById('logout-btn');

    // ── XSS Prevention Helper ──
    function escapeHTML(str) {
        if (!str) return '';
        return str.replace(/[&<>'"]/g, function(tag) {
            var charsToReplace = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            };
            return charsToReplace[tag] || tag;
        });
    }

    // ── Check if already logged in ──
    checkSession();

    async function checkSession() {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            showDashboard();
        } else {
            showLogin();
        }
    }

    // ── Login Logic ──
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const userVal = document.getElementById('admin-username').value.trim();
        const passVal = document.getElementById('admin-password').value;

        // Map the requested username to the Supabase Auth email
        let email = '';
        if (userVal.toLowerCase() === 'devesh') {
            email = 'devesh@admin.com';
        } else {
            loginError.textContent = "Invalid username or password.";
            loginError.style.display = 'block';
            return;
        }

        loginError.style.display = 'none';
        
        // Authenticate with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: passVal
        });

        if (error) {
            loginError.textContent = error.message;
            loginError.style.display = 'block';
        } else {
            showDashboard();
        }
    });

    // ── Logout Logic ──
    logoutBtn.addEventListener('click', async function() {
        await supabase.auth.signOut();
        showLogin();
    });

    // ── UI State Toggles ──
    function showLogin() {
        dashboardSection.style.display = 'none';
        loginSection.style.display = 'block';
        loginForm.reset();
    }

    function showDashboard() {
        loginSection.style.display = 'none';
        dashboardSection.style.display = 'block';
        loadReviews();
    }

    // ── Fetch and Render Reviews ──
    async function loadReviews() {
        reviewsList.innerHTML = '<p>Loading reviews...</p>';
        
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .order('created_at', { ascending: false });
            
        if (error) {
            reviewsList.innerHTML = '<p style="color:red">Error loading reviews: ' + error.message + '</p>';
            return;
        }

        if (data.length === 0) {
            reviewsList.innerHTML = '<p>No reviews found.</p>';
            return;
        }

        reviewsList.innerHTML = '';
        data.forEach(review => {
            const card = document.createElement('div');
            card.className = 'admin-review-card';
            
            const content = document.createElement('div');
            content.className = 'admin-review-content';
            const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
            
            var safeText = escapeHTML(review.text);
            var safeName = escapeHTML(review.name);
            
            content.innerHTML = `
                <strong style="color: #d4af37; font-size: 16px;">${safeName}</strong>
                <div style="color: #d4af37; font-size: 18px; margin: 4px 0;">${stars}</div>
                <p style="margin-top: 8px;">"${safeText}"</p>
                <small style="color: #666; font-size: 12px;">${new Date(review.created_at).toLocaleString('en-IN')}</small>
            `;
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = () => deleteReview(review.id);

            card.appendChild(content);
            card.appendChild(deleteBtn);
            reviewsList.appendChild(card);
        });
    }

    // ── Delete Review Logic ──
    async function deleteReview(id) {
        if (!confirm('Are you sure you want to delete this review?')) {
            return;
        }

        const { error } = await supabase
            .from('reviews')
            .delete()
            .eq('id', id);

        if (error) {
            alert('Failed to delete review: ' + error.message);
        } else {
            // Reload the list
            loadReviews();
        }
    }

    // ── Search Logic ──
    const searchInput = document.getElementById('search-reviews');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            const cards = reviewsList.querySelectorAll('.admin-review-card');
            cards.forEach(card => {
                const nameEl = card.querySelector('strong');
                if (nameEl) {
                    const name = nameEl.textContent.toLowerCase();
                    if (name.includes(query)) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    }
});
