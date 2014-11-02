express = require 'express'
bodyParser = require 'body-parser'
nodemailer = require 'nodemailer'

app = express()
app.use bodyParser.json()
app.use bodyParser.urlencoded extended: true
app.use express.static __dirname + '/old-site'

transporter = nodemailer.createTransport
  service: process.env.NODEMAILER_SERVICE
  secure: true
  auth:
    user: process.env.NODEMAILER_EMAIL
    pass: process.env.NODEMAILER_PASS

app.post '/email', (req, res, next) ->
  orderedFields = [ 'Subject', 'CustomerName', 'EmailAddress', 'Comments' ]

  text = "Received web inquiry:\n\n"
  for field in orderedFields when value = req.body[field]
    value = value.replace /\r\n/g, '\n'
    if -1 isnt value.indexOf '\n'
      value = '\n' + value.replace /^/mg, '    '
    text += "#{field}: #{value}\n"

  transporter.sendMail
    from: process.env.NODEMAILER_EMAIL
    to: process.env.NODEMAILER_EMAIL
    subject: req.body.subject || 'inquiries'
    text: text
    (err, info) ->
      if err?
        console.error "Error sending email: ", err
        return res.status(500).send()
      console.log "Sent email with req body", req.body
      res.redirect req.body.redirect || '/'

app.listen (port = process.env.PORT or 8080), ->
  console.log "Listening on port #{port}"
