const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://tjhtplbngkyziktmdmer.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const BOOK_LINK = process.env.CLOUDINARY_BOOK_URL || 'https://placeholder-cloudinary-link.pdf';

// ── Send email via Resend API (replaces nodemailer/Gmail) ──
// Resend: 3,000 emails/month free, then $20/month for 50,000
async function sendBookEmail(toEmail, toName, downloadLink) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const FROM_EMAIL = process.env.FROM_EMAIL || 'orders@resend.dev'; // Use your verified domain later

  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set — email skipped');
    return;
  }

  const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:Georgia,serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;border-bottom:1px solid #D4AF37;padding-bottom:24px;margin-bottom:32px;">
      <h1 style="color:#D4AF37;font-size:28px;margin:0;">Dr. Devesh Bhargude</h1>
      <p style="color:#aaa;font-size:13px;margin:6px 0 0;">Redefining Residency Life In Your Own Terms</p>
    </div>
    <h2 style="color:#fff;font-size:22px;">Your Purchase is Confirmed, ${toName}!</h2>
    <p style="color:#ccc;line-height:1.7;">
      Thank you for purchasing <strong style="color:#D4AF37;">Redefining Residency Life In Your Own Terms</strong>.
      Your e-book is ready. Click the secure button below to download it.
    </p>
    <div style="text-align:center;margin:36px 0;">
      <a href="${downloadLink}"
         style="display:inline-block;background:#D4AF37;color:#000;text-decoration:none;
                padding:14px 36px;font-weight:bold;font-size:16px;letter-spacing:1px;border-radius:4px;">
        Download Your E-Book
      </a>
    </div>
    <p style="color:#888;font-size:13px;line-height:1.6;">
      Please save this file to your device. If you have any issues, reply to this email and we will help you.
    </p>
    <div style="border-top:1px solid #333;margin-top:40px;padding-top:20px;text-align:center;">
      <p style="color:#555;font-size:12px;">© 2025 Dr. Devesh Bhargude · All rights reserved</p>
    </div>
  </div>
</body>
</html>`;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: `Dr. Devesh Bhargude <${FROM_EMAIL}>`,
      to: [toEmail],
      subject: 'Your E-Book is Ready — Redefining Residency Life',
      html: htmlBody
    })
  });

  if (!response.ok) {
    const err = await response.text();
    console.error('Resend email error:', err);
  } else {
    console.log('Email sent via Resend to', toEmail);
  }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing payment verification details' });
  }

  try {
    // 1. Verify Razorpay signature (cryptographic proof of payment)
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // 2. Update Supabase record to mark as 'paid'
    const { data, error } = await supabase
      .from('purchases')
      .update({
        razorpay_payment_id: razorpay_payment_id,
        status: 'paid',
        updated_at: new Date().toISOString()
      })
      .eq('razorpay_order_id', razorpay_order_id)
      .select();

    if (error) {
      console.error('Supabase update error:', error);
    }

    const buyerEmail = data && data[0] ? data[0].email : null;
    const buyerName  = data && data[0] ? data[0].name : 'Reader';

    // 3. Send email via Resend (non-blocking — don't fail payment if email fails)
    if (buyerEmail) {
      sendBookEmail(buyerEmail, buyerName, BOOK_LINK).catch(console.error);
    }

    // 4. Return success with download link
    return res.status(200).json({
      success: true,
      downloadLink: BOOK_LINK
    });

  } catch (err) {
    console.error('Verification server error:', err);
    return res.status(500).json({ error: 'Server error during verification' });
  }
};
