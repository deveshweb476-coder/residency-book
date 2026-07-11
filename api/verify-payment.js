const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');

const supabaseUrl = process.env.SUPABASE_URL || 'https://tjhtplbngkyziktmdmer.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const BOOK_LINK = process.env.CLOUDINARY_BOOK_URL || 'https://placeholder-cloudinary-link.pdf';

// Setup Nodemailer transporter using Vercel environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASS  
  }
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing payment verification details' });
  }

  try {
    // 1. Verify Razorpay signature
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
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
    const buyerName = data && data[0] ? data[0].name : 'Reader';

    // 3. Send the E-Book email using Nodemailer
    if (buyerEmail && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const mailOptions = {
        from: `"Dr. Devesh Bhargude" <${process.env.SMTP_USER}>`,
        to: buyerEmail,
        subject: '📥 Your E-Book Download is Ready: Redefining Residency Life',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #c9a84c;">🎉 Payment Successful!</h2>
            <p style="font-size: 16px;">Thank you for your purchase, <strong>${buyerName}</strong>!</p>
            <p style="font-size: 16px;">Your copy of <strong>Redefining Residency Life In Your Own Terms</strong> is ready for download.</p>
            
            <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; border: 1px solid #eee;">
              <a href="${BOOK_LINK}" style="display: inline-block; background: #0a1128; color: #c9a84c; padding: 15px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase;">
                📥 Download E-Book
              </a>
            </div>
            
            <p style="font-size: 14px; line-height: 1.5;">This book is a culmination of years of unconventional learning. I hope it brings you immense value.<br><br>Best regards,<br><strong>Dr. Devesh Bhargude</strong></p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #aaa; font-size: 12px;">If you have any issues downloading your book, please reply to this email.</p>
          </div>
        `
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`Email successfully sent to ${buyerEmail}`);
      } catch (emailError) {
        console.error('Failed to send email via nodemailer:', emailError);
      }
    } else {
      console.log('Skipped sending email. Missing buyer email or SMTP credentials.');
    }

    res.status(200).json({ success: true, downloadLink: BOOK_LINK });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
