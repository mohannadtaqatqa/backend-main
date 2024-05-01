import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'taqatqamohannad@gmail.com',
    pass: 'lnkv vugu vspl vvyp'
  }
});

const sendEmail = async (to: string, subject: string, text: string) => {
  const mailOptions = {
    from: 'taqatqamohannad@gmail.com',
    to,
    subject,
    text
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;