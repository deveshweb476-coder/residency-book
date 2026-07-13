const Razorpay = require('razorpay');
const { createClient } = require('@supabase/supabase-js');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const supabaseUrl = 'https://tjhtplbngkyziktmdmer.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    // ── Fetch live price from Supabase settings table ──
    let amount = 29900; // Fallback default: ₹299 in paise
    const { data: settingsData } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'book_price')
      .single();

    if (settingsData && settingsData.value) {
      const parsed = parseInt(settingsData.value, 10);
      if (!isNaN(parsed) && parsed > 0) {
        amount = parsed; // Value stored in paise (e.g. 29900 = ₹299)
      }
    }

    // ── Check if already paid ──
    const { data: existingPurchase } = await supabase
      .from('purchases')
      .select('status, name')
      .eq('email', email)
      .eq('status', 'paid')
      .limit(1)
      .single();

    if (existingPurchase && existingPurchase.status === 'paid') {
      const BOOK_LINK = process.env.CLOUDINARY_BOOK_URL || 'https://placeholder-cloudinary-link.pdf';
      
      // ── TEMPORARY TEST: Resend the email so you can verify it without paying again ──
      try {
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });
        const buyerName = existingPurchase.name || name || 'Reader';
        const mailOptions = {
          from: `"Dr. Devesh Bhargude" <${process.env.SMTP_USER}>`,
          to: email,
          subject: 'Your E-Book is Ready — Redefining Residency Life',
          html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:Georgia,serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;border-bottom:1px solid #D4AF37;padding-bottom:24px;margin-bottom:32px;">
      <h1 style="color:#D4AF37;font-size:28px;margin:0;">Dr. Devesh Bhargude</h1>
      <p style="color:#aaa;font-size:13px;margin:6px 0 0;">Redefining Residency Life In Your Own Terms</p>
    </div>
    <h2 style="color:#fff;font-size:22px;">Your Purchase is Confirmed, ${buyerName}!</h2>
    <p style="color:#ccc;line-height:1.7;">
      Thank you for purchasing <strong style="color:#D4AF37;">Redefining Residency Life In Your Own Terms</strong>.
      Your e-book is ready. Click the secure button below to download it.
    </p>
    <div style="text-align:center;margin:36px 0;">
      <a href="${BOOK_LINK}"
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
</html>`
        };
        await transporter.sendMail(mailOptions);
        console.log('Test resend successful to', email);
      } catch (err) {
        console.error('Test resend failed:', err);
      }

      return res.status(200).json({
        alreadyPaid: true,
        downloadLink: BOOK_LINK
      });
    }

    const options = {
      amount: amount,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };
    const order = await razorpay.orders.create(options);


    const { error } = await supabase
      .from('purchases')
      .insert([
        {
          name,
          email,
          razorpay_order_id: order.id,
          status: 'pending'
        }
      ]);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to record purchase intent' });
    }

    res.status(200).json({
      orderId: order.id,
      amount: options.amount,
      key_id: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Razorpay/Server error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};
