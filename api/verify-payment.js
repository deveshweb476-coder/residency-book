const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');

const supabaseUrl = 'https://tjhtplbngkyziktmdmer.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const BOOK_LINK = process.env.BOOK_DOWNLOAD_LINK || 'https://placeholder-cloudinary-link.pdf';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing payment verification details' });
  }

  try {
    // Verify signature
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // Payment is verified. Update Supabase record.
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

    // Send email via Resend
    if (resend && buyerEmail) {
      try {
        await resend.emails.send({
          from: 'Dr. Devesh <noreply@drdevesh.com>', // User needs to verify domain on Resend
          to: [buyerEmail],
          subject: 'Your E-Book: Redefining Residency Life',
          html: `<p>Hi ${buyerName},</p>
                 <p>Thank you for purchasing <strong>Redefining Residency Life In Your Own Terms</strong>.</p>
                 <p>You can download your copy using the secure link below:</p>
                 <p><a href="${BOOK_LINK}">Download E-Book</a></p>
                 <p>Best regards,<br>Dr. Devesh Bhargude</p>`
        });
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
      }
    }

    res.status(200).json({ success: true, downloadLink: BOOK_LINK });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
