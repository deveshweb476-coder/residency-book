const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

css += `
/* Checkout Modal Styles */
.modal-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.8); backdrop-filter: blur(5px);
    display: flex; justify-content: center; align-items: center;
    z-index: 10000; opacity: 0; pointer-events: none; transition: opacity 0.3s ease;
}
.modal-overlay.active {
    opacity: 1; pointer-events: auto;
}
.checkout-modal-content {
    background: #0f172a; padding: 40px; border-radius: 8px;
    border: 1px solid rgba(212, 175, 55, 0.3); width: 90%; max-width: 500px; position: relative;
    transform: translateY(20px); transition: transform 0.3s ease;
    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
}
.modal-overlay.active .checkout-modal-content {
    transform: translateY(0);
}
.modal-close {
    position: absolute; top: 15px; right: 20px; font-size: 28px;
    background: none; border: none; color: #fff; cursor: pointer;
    transition: color 0.3s;
}
.modal-close:hover {
    color: var(--gold);
}
#btn-proceed-payment:disabled {
    opacity: 0.5; cursor: not-allowed;
}
`;

fs.writeFileSync('style.css', css);
console.log('Appended modal CSS');
