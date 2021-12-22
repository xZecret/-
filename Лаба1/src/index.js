const http = require("http");
const url = require("url");
var days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
var now = new Date();
var dayofweek = now.getDay();
http
  .createServer(function (req, res) {
    var query = url.parse(req.url, true).query;
    res.write("Hello ");
    if ("name" in query) {
      res.write(query["name"]);
    } else {
      res.write("noname");
    }
    res.write(", today is ");
    res.write(days[dayofweek]);
  })
  .listen(8080);
