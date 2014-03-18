var http = require('http')
var fs = require('fs')
var request = require('superagent')
var route = require('router')()

route.get('/{app}', function(req, res) {
  res.writeHead(200, {"Content-Type": "text/html"})
  res.write(fs.readFileSync("index.html", "utf8"))
  res.end()
})

route.get('/api/{app}', function(req, res) {

  var url = "https://:" + process.env.HEROKU_API_KEY + "@api.heroku.com/apps/" + req.params.app

  request
    .get(url)
    .set('Accept', 'application/json')
    .end(function(error, response){

      if (error) throw error
      // console.log(res.headers)
      res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS"
      })

      if (String(response.headers.status).match(/404/)) {
        res.end(JSON.stringify(true))
      } else {
        res.end(JSON.stringify(false))
      }

    })
})

http.createServer(route).listen(process.env.PORT || 5000)
