const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Please provide an email query parameter, e.g. /api/test-email?email=yourname@gmail.com' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const mailOptions = {
      from: `"Dr. Devesh Bhargude" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Test Email - Residency Book',
      text: 'If you are reading this, your email configuration in Vercel is working perfectly!'
    };

    const info = await transporter.sendMail(mailOptions);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Test email sent successfully!', 
      info: info.response 
    });
  } catch (error) {
    console.error('Test email failed:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message,
      hint: "Make sure SMTP_USER is your Gmail and SMTP_PASS is an APP PASSWORD (not your normal password)."
    });
  }
};
