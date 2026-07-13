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
    const purchasesList = document.getElementById('admin-purchases-list');
    const logoutBtn = document.getElementById('logout-btn');
    
    // Tabs
    const tabReviews = document.getElementById('tab-reviews');
    const tabPurchases = document.getElementById('tab-purchases');
    const tabSettings = document.getElementById('tab-settings');
    const reviewsView = document.getElementById('reviews-view');
    const purchasesView = document.getElementById('purchases-view');
    const settingsView = document.getElementById('settings-view');

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
        loadPurchases();
    }
    
    // ── Tab Toggles ──
    if (tabReviews && tabPurchases) {
        function setActiveTab(activeBtn, activeView) {
            // Reset all tabs
            [tabReviews, tabPurchases, tabSettings].forEach(b => { if (b) b.className = 'logout-btn'; });
            [reviewsView, purchasesView, settingsView].forEach(v => { if (v) v.style.display = 'none'; });
            // Set active
            activeBtn.className = 'login-btn';
            activeView.style.display = 'block';
        }

        tabReviews.addEventListener('click', () => {
            setActiveTab(tabReviews, reviewsView);
        });

        tabPurchases.addEventListener('click', () => {
            setActiveTab(tabPurchases, purchasesView);
            loadPurchases();
        });

        if (tabSettings) {
            tabSettings.addEventListener('click', () => {
                setActiveTab(tabSettings, settingsView);
                loadSettings();
            });
        }
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

    // ── Fetch and Render Purchases ──
    async function loadPurchases() {
        if (!purchasesList) return;
        purchasesList.innerHTML = '<p>Loading purchases...</p>';
        
        const { data, error } = await supabase
            .from('purchases')
            .select('*')
            .order('created_at', { ascending: false });
            
        if (error) {
            purchasesList.innerHTML = '<p style="color:red">Error loading purchases: ' + error.message + '</p>';
            return;
        }

        if (!data || data.length === 0) {
            purchasesList.innerHTML = '<p>No purchases found yet.</p>';
            return;
        }

        let html = '<table style="width:100%; text-align:left; border-collapse:collapse; margin-top:1rem;">';
        html += '<tr style="border-bottom:1px solid #444; color:#d4af37;"><th style="padding:10px;">Date</th><th style="padding:10px;">Name</th><th style="padding:10px;">Email</th><th style="padding:10px;">Order ID / Payment ID</th><th style="padding:10px;">Status</th></tr>';
        
        data.forEach(p => {
            let dateStr = new Date(p.created_at).toLocaleString('en-IN');
            let color = p.status === 'paid' ? '#2ecc71' : '#e74c3c';
            let rzpOrder = p.razorpay_order_id ? escapeHTML(p.razorpay_order_id) : 'N/A';
            let rzpPayment = p.razorpay_payment_id ? escapeHTML(p.razorpay_payment_id) : 'Pending';

            html += `<tr style="border-bottom:1px solid #333;">
                <td style="padding:12px 10px; font-size:14px; vertical-align:top;">${dateStr}</td>
                <td style="padding:12px 10px; font-size:14px; font-weight:600; vertical-align:top;">${escapeHTML(p.name)}</td>
                <td style="padding:12px 10px; font-size:14px; color:#aaa; vertical-align:top;">${escapeHTML(p.email)}</td>
                <td style="padding:12px 10px; font-size:12px; color:#aaa; vertical-align:top;">Order: ${rzpOrder}<br>Pay: ${rzpPayment}</td>
                <td style="padding:12px 10px; font-size:14px; color:${color}; font-weight:bold; vertical-align:top;">${p.status.toUpperCase()}</td>
            </tr>`;
        });
        
        html += '</table>';
        purchasesList.innerHTML = html;
    }
    // ── Load + Save Settings (Book Price) ──
    async function loadSettings() {
        const priceInput = document.getElementById('price-input');
        const priceStatus = document.getElementById('price-status');
        if (!priceInput) return;

        priceStatus.textContent = 'Loading current price...';
        priceStatus.style.color = '#aaa';

        const { data, error } = await supabase
            .from('settings')
            .select('value')
            .eq('key', 'book_price')
            .single();

        if (error || !data) {
            priceStatus.textContent = 'Could not load current price. Make sure the settings table exists in Supabase.';
            priceStatus.style.color = '#e74c3c';
            return;
        }

        // Value is stored in paise — display in rupees
        priceInput.value = Math.round(parseInt(data.value) / 100);
        priceStatus.textContent = `Current price: ₹${priceInput.value}`;
        priceStatus.style.color = '#2ecc71';
    }

    const savePriceBtn = document.getElementById('save-price-btn');
    if (savePriceBtn) {
        savePriceBtn.addEventListener('click', async () => {
            const priceInput = document.getElementById('price-input');
            const priceStatus = document.getElementById('price-status');
            const rupees = parseInt(priceInput.value);

            if (isNaN(rupees) || rupees < 1) {
                priceStatus.textContent = 'Please enter a valid price.';
                priceStatus.style.color = '#e74c3c';
                return;
            }

            const paise = rupees * 100; // Convert ₹ to paise for Razorpay
            savePriceBtn.disabled = true;
            savePriceBtn.textContent = 'Saving...';

            const { error } = await supabase
                .from('settings')
                .upsert({ key: 'book_price', value: String(paise), updated_at: new Date().toISOString() });

            savePriceBtn.disabled = false;
            savePriceBtn.textContent = 'Save Price';

            if (error) {
                priceStatus.textContent = 'Error saving price: ' + error.message;
                priceStatus.style.color = '#e74c3c';
            } else {
                priceStatus.textContent = `✅ Price updated to ₹${rupees}. Live immediately on next checkout!`;
                priceStatus.style.color = '#2ecc71';
            }
        });
    }
});
