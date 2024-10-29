//Server for email password recovery

import express from 'express';
import nodemailer from 'nodemailer';

const app = express();
const port = 5000;

app.use(express.json());

// Password reset endpoint
app.post('/api/password-reset', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Create a transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'jduplaaa@gmail.com', // Replace with your email
        pass: 'Modernfire941',        // Replace with your password
      },
    });

    // Create an email message
    const mailOptions = {
      from: 'jduplaaa@gmail.com',
      to: email,
      subject: 'Password Reset Request',
      text: 'Click the link below to reset your password:\n\nhttp://localhost:3000/reset-password?token=your_generated_token_here',
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Password reset email sent!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error sending password reset email.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
