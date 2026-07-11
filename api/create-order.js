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
    const amount = 29900; // INR 299 in paise
    
    const options = {
      amount: amount, 
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };
    const order = await razorpay.orders.create(options);

    const { data, error } = await supabase
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

    res.status(200).json({ orderId: order.id, amount: options.amount, key_id: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    console.error('Razorpay/Server error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};
