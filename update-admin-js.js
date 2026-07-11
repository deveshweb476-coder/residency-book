const fs = require('fs');
let js = fs.readFileSync('admin.js', 'utf8');

const fetchPurchases = `
async function fetchPurchases() {
    const tbody = document.getElementById('purchasesTableBody');
    const countEl = document.getElementById('totalPurchases');
    if (!tbody || !countEl) return;
    
    try {
        const { data, error } = await _supabase
            .from('purchases')
            .select('*')
            .eq('status', 'paid')
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        
        countEl.textContent = data.length;
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No purchases yet</td></tr>';
            return;
        }
        
        tbody.innerHTML = data.map(p => \`
            <tr>
                <td>\${new Date(p.created_at).toLocaleString()}</td>
                <td>\${escapeHtml(p.name)}</td>
                <td>\${escapeHtml(p.email)}</td>
                <td>\${escapeHtml(p.razorpay_order_id)}</td>
                <td><span class="status-badge status-active">Paid</span></td>
            </tr>
        \`).join('');
    } catch (err) {
        console.error('Error fetching purchases:', err);
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: red;">Failed to load data</td></tr>';
        countEl.textContent = 'Error';
    }
}
`;

js = js.replace('// Initialization', fetchPurchases + '\n// Initialization\nfetchPurchases();\n');

fs.writeFileSync('admin.js', js);
console.log('Updated admin JS');
