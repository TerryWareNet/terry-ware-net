renderOrRedirect = (res, page, data) ->
  res.render page, data, (err, html) ->
    if err
      res.redirect "/"
    else
      res.send html
    return
  return

express = require("express")
app = express()

fs = require("fs")
DataParser = require("cloud/services/data-parser.js")

app.locals.Formatter = require("cloud/services/formatter.js")
app.set "views", "cloud/views"
app.set "view engine", "jade"

app.get "/", (req, res) ->
  res.render "index"
  return

app.get "/tw_contact.html", (req, res) ->
  res.render "tw_contact"
  return

app.get "/tw_:number(\\d+).html", (req, res) ->
  thisNumber = parseInt(req.params.number)
  renderOrRedirect res, "tw",
    thisNumber: thisNumber
    maxNumber: tw.length
    desc: tw[thisNumber - 1]
    prefix: "tw_"
    padding: 2

  return

app.get "/tw_new:number(\\d+).html", (req, res) ->
  thisNumber = parseInt(req.params.number)
  renderOrRedirect res, "tw_new",
    thisNumber: thisNumber
    maxNumber: tw_new.length
    desc: tw_new[thisNumber - 1]
    prefix: "tw_new"
    padding: 1

  return

app.post "/test", (req, res) ->
  
  # POST http://example.parseapp.com/test (with request body "message=hello")
  res.send req.body.message
  return


# Attach the Express app to Cloud Code.
Parse.initialize "Ig1obxPL8urC3KUx7SxLUA5WvygdvwZuFcEvp3zq", "Whw4i8WRBgyzToQu14wSbIqA8HOXm44UOJQmPKi1"
Parse.Config.get().then (config) ->
  tw = DataParser.parse(config.get("tw"))
  tw_new = DataParser.parse(config.get("tw_new"))
  app.listen()
  return

