//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
let items=[];
let workItems=[];
app.get("/", function(req, res){
  var today= new Date();
  var currentDay= today.getDay();
  var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
var day=  today.toLocaleDateString("en-US", options);

res.render("list",{
  listTitle: day, listItems: items
});



});
app.post("/",(req,res)=>{
    let item=req.body.things_to_do;
  if(req.body.list==="workList"){
    workItems.push(item);
    res.redirect("/work");
  }
  else{



  items.push(item);
res.redirect("/");
}
});
app.get("/work",(req,res)=>{
  res.render("list",{listTitle:"workList",listItems:workItems});
});


app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
