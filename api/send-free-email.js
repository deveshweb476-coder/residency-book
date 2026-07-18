const nodemailer = require('nodemailer');

const BOOK_LINK = process.env.BOOK_DOWNLOAD_URL; // Must be set in Vercel Environment Variables

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

  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Missing name or email' });
  }

  try {
    // Send the E-Book email using Nodemailer (Gmail)
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      const mailOptions = {
        from: `"Dr. Devesh Bhargude" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Here is your E-Book: Redefining Residency Life',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #D4AF37;">Hi ${name},</h2>
            <p>Thank you for getting the book during our free promotion!</p>
            <p>You can download or read your E-Book using the secure link below:</p>
            
            <div style="margin: 30px 0; text-align: center;">
              <a href="${BOOK_LINK}" style="background-color: #D4AF37; color: #000; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block; font-size: 16px;">
                Access E-Book
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666;">If the button doesn't work, copy this link into your browser:<br>
            <a href="${BOOK_LINK}" style="color: #D4AF37; word-break: break-all;">${BOOK_LINK}</a></p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p>Best regards,<br><strong>Dr. Devesh Bhargude</strong></p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
    }

    return res.status(200).json({ success: true, downloadLink: BOOK_LINK });
  } catch (err) {
    console.error('Email error:', err);
    // Even if email fails, we still want them to see the success screen
    return res.status(200).json({ success: true, downloadLink: BOOK_LINK, emailError: err.message });
  }
};
