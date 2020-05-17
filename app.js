const express = require("express");
const bodyParser = require("body-parser");
const path=require("path");
const app=express();
app.use(express.static(path.join(__dirname, "build")));

app.get("/", function(req, res){
  return res.send("<h1>Working</h1>");
});


app.listen(process.env.PORT || 3000, function(){
  console.log("Server started on port 3000");
});
