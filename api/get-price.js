const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://tjhtplbngkyziktmdmer.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let amount = 299; // Fallback default: ₹299
    const { data: settingsData } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'book_price')
      .single();

    if (settingsData && settingsData.value) {
      const parsed = parseInt(settingsData.value, 10);
      if (!isNaN(parsed) && parsed > 0) {
        amount = parsed / 100; // Value is in paise (e.g. 29900 = ₹299)
      }
    }

    res.status(200).json({ price: amount });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Failed to fetch price' });
  }
};
