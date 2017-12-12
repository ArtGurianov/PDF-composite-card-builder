const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.static(path.join(__dirname, '../public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());

app.get('*',(req,res) => {
  res.sendFile(__dirname, '../public/index.html');
});

app.post('/api/generate_pdf', (req, res) => {
	var pics = req.body.pics;
  var doc = new PDFDocument({
  	layout: 'landscape',
  	size: 'A4',
    info: {
      Title: 'ArtGurianov.com',
      Author: 'Art Gurianov'
    }
  });
  var compath = path.join(__dirname, '/../public/CustomComposite.pdf');
  doc.pipe(fs.createWriteStream(compath));
  /*doc.fontSize(15).text('Wally Gator !', 50, 50);
  doc.text('Wally Gator is a swinging alligator in the swamp. He\'s the greatest percolator when he really starts to romp. There has never been a greater operator in the swamp. See ya later, Wally Gator.', {
    width: 410,
    align: 'left'
  });*/
  doc.image(__dirname + '/../public/images/' + pics[0], 10, 10, {
    height: 550
  }).rect(10, 10, 366, 550).stroke();

  doc.image(__dirname + '/../public/images/' + pics[1], 405, 10, {
    height: 280
  }).rect(405, 10, 187, 280).stroke();

  doc.image(__dirname + '/../public/images/' + pics[2], 600, 10, {
    height: 280
  }).rect(600, 10, 187, 280).stroke();

  doc.image(__dirname + '/../public/images/' + pics[3], 405, 300, {
    height: 280
  }).rect(405, 300, 187, 280).stroke();

  doc.image(__dirname + '/../public/images/' + pics[4], 600, 300, {
    height: 280
  }).rect(600, 300, 187, 280).stroke();

  doc.image(__dirname + '/../public/images/PDFtitle.jpg', 800, 0, {
    height: 600
  });
  doc.image(__dirname + '/../public/images/PDFmeasurement.jpg', 10, 570, {
    height: 11
  });
  doc.end();
  res.send({status: 'OK'});
});

app.post('/api/send_email', (req, res) => {
  var formName = req.body.formName;
  var formCompany = req.body.formCompany;
  var formEmail = req.body.formEmail;
  var formPhone = req.body.formPhone;
  var formSubject = req.body.formSubject;
  var formMessage = req.body.formMessage;


  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'guryan1996@gmail.com', // Your email id
      pass: '4hnpsabCpAW6' // Your password
    }
  });

  var mailOptions = {
    from: 'guryan1996@gmail.com', // sender address
    to: 'artgurianov@yandex.ru', // list of receivers
    subject: formSubject, // Subject line
    text: `Hello! My name is ${formName}! I work in ${formCompany} company :) I have an offer for you about ${formSubject}! Please call me back: ${formPhone}!` //, // plaintext body
    //text: text
    // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
  };

  transporter.sendMail(mailOptions, function(error, info){
    if(error){
      console.log(error);
      res.send('Err');
    }else{
      res.send('OK');
    };
  });


});

app.listen(process.env.PORT || 3000, function() {
	console.log('server started on port 3000...');
});
