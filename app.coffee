express = require("express")
app = express()
app.use express.static __dirname + '/old-site'
app.listen (port = process.env.PORT or 8080), ->
  console.log "Listening on port #{port}"