const fs = require('fs');
let html = fs.readFileSync('d7x9k2-management.html', 'utf8');

const tableHTML = `
            <!-- Purchases Section -->
            <section id="purchases-section" class="tab-content" style="display: none;">
                <h2>E-Book Purchases</h2>
                <div class="stats-card" style="margin-bottom: 20px; padding: 20px; background: #fff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                    <h3 style="margin-top: 0; color: #4b5563;">Total Purchases</h3>
                    <p id="totalPurchases" style="font-size: 2rem; font-weight: bold; color: var(--gold); margin: 0;">Loading...</p>
                </div>
                
                <table class="data-table" id="purchasesTable">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Order ID</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody id="purchasesTableBody">
                        <tr><td colspan="5" style="text-align: center;">Loading purchases...</td></tr>
                    </tbody>
                </table>
            </section>
`;

html = html.replace('<!-- End Content Sections -->', tableHTML + '\n            <!-- End Content Sections -->');
html = html.replace('<li><button class="nav-btn" data-target="logs-section">Access Logs</button></li>', '<li><button class="nav-btn" data-target="logs-section">Access Logs</button></li>\n                <li><button class="nav-btn" data-target="purchases-section">Purchases</button></li>');

fs.writeFileSync('d7x9k2-management.html', html);
console.log('Updated management HTML');
