import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'atrashkareem@gmail.com',
    pass: 'ejws ceac pxoe vnin'
  }
});

const sendEmail = async (to: string, subject: string, text: string) => {
  const mailOptions = {
    from: 'atrashkareem@gmail.com',
    to,
    subject,
    text
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;