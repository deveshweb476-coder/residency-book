const fs = require('fs');

let js = fs.readFileSync('main.js', 'utf8');

js += `
/* ==========================================================================
   Checkout Modal & Razorpay Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const checkoutOverlay = document.getElementById('checkoutModalOverlay');
    const checkoutClose = document.getElementById('btnCheckoutClose');
    const formStep = document.getElementById('checkout-form-step');
    const successStep = document.getElementById('checkout-success-step');
    const checkoutForm = document.getElementById('checkoutForm');
    const btnProceed = document.getElementById('btn-proceed-payment');
    
    // Buttons that open checkout
    const directBuyBtns = document.querySelectorAll('.btn-buy-direct, .btn-buy-direct-chapter');
    
    function openCheckout() {
        formStep.style.display = 'block';
        successStep.style.display = 'none';
        checkoutForm.reset();
        checkoutOverlay.classList.add('active');
    }
    
    function closeCheckout() {
        checkoutOverlay.classList.remove('active');
    }
    
    directBuyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openCheckout();
        });
    });
    
    if (checkoutClose) {
        checkoutClose.addEventListener('click', closeCheckout);
    }
    
    checkoutOverlay.addEventListener('click', (e) => {
        if (e.target === checkoutOverlay) closeCheckout();
    });
    
    checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('buyerName').value;
        const email = document.getElementById('buyerEmail').value;
        
        if (!name || !email) return alert('Name and email are required');
        
        btnProceed.disabled = true;
        btnProceed.textContent = 'Processing...';
        
        try {
            // 1. Create order
            const res = await fetch('/api/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email })
            });
            
            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.error || 'Failed to create order');
            }
            
            // 2. Open Razorpay
            const options = {
                key: "YOUR_RAZORPAY_KEY_ID_HERE", // Replaced on backend usually, but for frontend checkout we need the public key ID.
                amount: data.amount,
                currency: "INR",
                name: "Dr. Devesh Bhargude",
                description: "Redefining Residency Life In Your Own Terms",
                order_id: data.orderId,
                handler: async function (response) {
                    btnProceed.textContent = 'Verifying...';
                    // 3. Verify payment
                    try {
                        const verifyRes = await fetch('/api/verify-payment', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            })
                        });
                        
                        const verifyData = await verifyRes.json();
                        
                        if (verifyRes.ok && verifyData.success) {
                            // Show success step
                            formStep.style.display = 'none';
                            successStep.style.display = 'block';
                            document.getElementById('direct-download-link').href = verifyData.downloadLink;
                        } else {
                            alert('Payment verification failed. If money was deducted, please contact support.');
                            btnProceed.disabled = false;
                            btnProceed.textContent = 'Proceed to Payment (₹299)';
                        }
                    } catch (err) {
                        alert('Error verifying payment.');
                        btnProceed.disabled = false;
                        btnProceed.textContent = 'Proceed to Payment (₹299)';
                    }
                },
                prefill: {
                    name: name,
                    email: email
                },
                theme: {
                    color: "#D4AF37"
                }
            };
            
            // Note: We need to pull Razorpay key from somewhere. For now, it will fail until the user provides it.
            // Ideally we fetch it from a non-secret endpoint or inject it.
            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response){
                alert('Payment failed: ' + response.error.description);
                btnProceed.disabled = false;
                btnProceed.textContent = 'Proceed to Payment (₹299)';
            });
            rzp.open();
            
        } catch (error) {
            alert('Error: ' + error.message);
            btnProceed.disabled = false;
            btnProceed.textContent = 'Proceed to Payment (₹299)';
        }
    });
});
`;

fs.writeFileSync('main.js', js);
console.log('Updated main.js logic');
