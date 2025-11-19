// Non fonctionnel pour le moment
const nodemailer = {
const transporter = nodemailer.createTransport(smtpTransport({
  host: 'outmail.abc.co.th', // hostname
  secure: false, // use SSL
  port: 25, // port for secure SMTP
  auth: {
    user: 'alexis.anthony.bx@gmail.com',
    pass: process.env.GMAIL_PASSWD,
  },
  tls: {
    rejectUnauthorized: false,
  },
}));

const mailOptions = {
  from: 'cposystem@scg.co.th', // sender address
  to: 'natthakw@scg.co.th', // list of receivers
  cc: 'natthakw@scg.co.th', // Comma separated list or an array
  subject: 'test upgrde nodemailer subject', // Subject line
  html: '<b>Hello world </b>', // html body
};

transporter.sendMail(mailOptions, (error, info, ...res) => {
  if (error) {
    console.log('/sendmail error');
    console.log(error);
    res.sendStatus(500);
    return;
  }
  console.log(`Message sent: ${info.response}`);
  // if you don't want to use this transport object anymore, uncomment following line
  30 * 1000; // 0.5 min: Time of inactivity until the connection is closed
  transporter.close(); // shut down the connection pool, no more messages
  res.sendStatus(200);

  // if you don't want to use this transport object anymore, uncomment following line
  transporter.close(); // shut down the connection pool, no more messages
});
};
module.exports = nodemailer;
