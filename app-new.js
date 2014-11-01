// These two lines are required to initialize Express in Cloud Code.
var express = require('express');
var app = express();
var fs = require('fs');
var DataParser = require('cloud/services/data-parser.js');
var tw = '', tw_new = '';

// Global app configuration section
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'jade');    // Set the template engine
app.use(express.bodyParser());    // Middleware for reading request body
app.locals.Formatter = require('cloud/services/formatter.js');

function renderOrRedirect(res, page, data) {
    res.render(page, data, function (err, html) {
        if (err) {res.redirect('/'); } else {res.send(html); }
    });
}

app.get('/', function(req, res) {res.render('index');});

app.get('/tw_contact.html', function(req, res) {
    res.render('tw_contact');
});

app.get('/tw_:number(\\d+).html', function(req, res) {
    var thisNumber = parseInt(req.params.number);
    renderOrRedirect(res, 'tw', {
        thisNumber: thisNumber,
        maxNumber: tw.length,
        desc: tw[thisNumber-1],
        prefix: 'tw_',
        padding: 2,
    });
});

app.get('/tw_new:number(\\d+).html', function(req, res) {
    var thisNumber = parseInt(req.params.number);
    renderOrRedirect(res, 'tw_new', {
        thisNumber: thisNumber,
        maxNumber: tw_new.length,
        desc: tw_new[thisNumber-1],
        prefix: 'tw_new',
        padding: 1,
    });
});

app.post('/test', function(req, res) {
  // POST http://example.parseapp.com/test (with request body "message=hello")
  res.send(req.body.message);
});

// Attach the Express app to Cloud Code.
Parse.initialize('Ig1obxPL8urC3KUx7SxLUA5WvygdvwZuFcEvp3zq', 'Whw4i8WRBgyzToQu14wSbIqA8HOXm44UOJQmPKi1');
Parse.Config.get().then(function (config) {
        tw = DataParser.parse(config.get('tw'));
        tw_new = DataParser.parse(config.get('tw_new'));
        app.listen();
    });

