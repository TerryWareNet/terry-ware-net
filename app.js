// Generated by CoffeeScript 1.12.1
(function() {
  var app, bodyParser, express, nodemailer, port, transporter;

  express = require('express');

  bodyParser = require('body-parser');

  nodemailer = require('nodemailer');

  app = express();

  app.use(bodyParser.json());

  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(express["static"](__dirname + '/old-site'));

  transporter = nodemailer.createTransport({
    service: process.env.NODEMAILER_SERVICE,
    secure: true,
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASS
    }
  });

  app.post('/email', function(req, res, next) {
    var field, i, len, orderedFields, text, value;
    orderedFields = ['Subject', 'CustomerName', 'EmailAddress', 'Comments'];
    text = "Received web inquiry:\n\n";
    for (i = 0, len = orderedFields.length; i < len; i++) {
      field = orderedFields[i];
      if (!(value = req.body[field])) {
        continue;
      }
      value = value.replace(/\r\n/g, '\n');
      if (-1 !== value.indexOf('\n')) {
        value = '\n' + value.replace(/^/mg, '    ');
      }
      text += field + ": " + value + "\n";
    }
    return transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: process.env.NODEMAILER_TO_EMAIL || process.env.NODEMAILER_EMAIL,
      subject: req.body.subject || 'inquiries',
      text: text
    }, function(err, info) {
      if (err != null) {
        console.error("Error sending email: ", err);
        return res.status(500).send();
      }
      console.log("Sent email with req body", req.body);
      return res.redirect(req.body.redirect || '/');
    });
  });

  app.listen((port = process.env.PORT || 8080), function() {
    return console.log("Listening on port " + port);
  });

}).call(this);
