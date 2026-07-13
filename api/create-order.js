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
      .select('status')
      .eq('email', email)
      .eq('status', 'paid')
      .limit(1)
      .single();

    if (existingPurchase && existingPurchase.status === 'paid') {
      const BOOK_LINK = process.env.CLOUDINARY_BOOK_URL || 'https://placeholder-cloudinary-link.pdf';
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
