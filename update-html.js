const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Add Razorpay SDK
html = html.replace('</head>', '    <!-- Razorpay SDK -->\n    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>\n</head>');

// 2. Add checkout modal at the end before </body>
const modalHTML = `
    <!-- CHECKOUT MODAL -->
    <div class="modal-overlay" id="checkoutModalOverlay" style="display: none;">
        <div class="modal-content checkout-modal-content" style="max-width: 500px; text-align: center;">
            <button class="modal-close" id="btnCheckoutClose">&times;</button>
            <div id="checkout-form-step">
                <h2 style="font-family: var(--font-serif); color: var(--gold); margin-bottom: 10px; font-size: 2rem;">Get the E-Book</h2>
                <p style="margin-bottom: 25px; font-size: 0.95rem; color: #aaa;">Please enter your details. The book download link will be emailed to you securely.</p>
                <form id="checkoutForm" style="display: flex; flex-direction: column; gap: 15px; text-align: left;">
                    <div>
                        <label for="buyerName" style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; color: #fff;">Full Name</label>
                        <input type="text" id="buyerName" required style="width: 100%; padding: 12px; margin-top: 5px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.2); color: #fff; font-family: var(--font-sans); border-radius: 4px;" placeholder="John Doe">
                    </div>
                    <div>
                        <label for="buyerEmail" style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; color: #fff;">Real Email Address</label>
                        <input type="email" id="buyerEmail" required style="width: 100%; padding: 12px; margin-top: 5px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.2); color: #fff; font-family: var(--font-sans); border-radius: 4px;" placeholder="john@example.com">
                        <small style="color: #D4AF37; display: block; margin-top: 5px;">* Mandatory. Your e-book will be sent here.</small>
                    </div>
                    <button type="submit" id="btn-proceed-payment" style="margin-top: 10px; background: var(--gold); color: #000; border: none; padding: 15px; font-family: var(--font-sans); text-transform: uppercase; letter-spacing: 1px; font-weight: 600; cursor: pointer; border-radius: 4px; transition: all 0.3s;">Proceed to Payment (₹299)</button>
                </form>
            </div>
            
            <div id="checkout-success-step" style="display: none;">
                <h2 style="font-family: var(--font-serif); color: #4ade80; margin-bottom: 15px; font-size: 2rem;">Payment Successful!</h2>
                <p style="margin-bottom: 25px; font-size: 1rem; color: #fff;">Thank you for your purchase. An email has been sent to your address with the book.</p>
                <div style="background: rgba(74, 222, 128, 0.1); padding: 20px; border-radius: 8px; border: 1px solid rgba(74, 222, 128, 0.3);">
                    <p style="margin-bottom: 15px; color: #eee; font-size: 0.9rem;">You can also download it right now using the secure link below. Please save it to your device.</p>
                    <a href="#" id="direct-download-link" target="_blank" rel="noopener" style="display: inline-block; background: #4ade80; color: #000; text-decoration: none; padding: 12px 25px; font-family: var(--font-sans); text-transform: uppercase; letter-spacing: 1px; font-weight: 600; border-radius: 4px;">Download E-Book Now</a>
                </div>
            </div>
        </div>
    </div>
</body>`;
html = html.replace('</body>', modalHTML);

fs.writeFileSync('index.html', html);
console.log('Updated index.html modal and scripts');
