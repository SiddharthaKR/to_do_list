//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")
const app = express();
const _=require("lodash");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");

mongoose.connect("mongodb://localhost:27017/todolistDB",{ useNewUrlParser: true,useUnifiedTopology: true });

const itemsSchema= new mongoose.Schema({
  name: String
});
const listSchema={
  name: String,
  items: [itemsSchema]
};

const List= new mongoose.model("List",listSchema);
const Item= mongoose.model("Item",itemsSchema);



const item1 = new Item({
  name:"study"
});
const item2 = new Item({
  name:"play basketball"
});
const item3 = new Item({
  name:"dance"
});

const defaultItems=[item1,item2,item3];

// Item.insertMany(defaultItems,function(err){
//   if(err){
//     console.log(err);
//   }
//   else{
//     console.log("defaultItems succesfully inserted into our item collection")
//   }
// });


app.get("/", function(req, res){
//   var today= new Date();
//   var currentDay= today.getDay();
//   var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
// var day=  today.toLocaleDateString("en-US", options);
Item.find(function(err,items){
  if(err){
    console.log(err)
  }
  else{
    if(items.length==0){

      Item.insertMany(defaultItems,function(err){
        if(err){
          console.log(err);
        }
        else{
          console.log("defaultItems succesfully inserted into our item collection");
        }
      });
      res.redirect("/")
    }
else{
      res.render("list",{
        listTitle: "Today", listItems: items
    });
  }
}

});
});


app.post("/delete",(req,res)=>{
  const checkedItemId= req.body.checkbox;
  const listName=req.body.listName;

  if(listName==="Today"){
    Item.findByIdAndRemove(checkedItemId,function(err){
      if(err){
        console.log(err)
      }
      else{
        console.log("deleted successfully")
        res.redirect("/");
      }
  });

}else{
  List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}},function(err){
    if(!err){
      console.log("successfully deleted checked item from that list");
      res.redirect("/"+listName);
    }
  });
}
});

app.post("/",(req,res)=>{
    const itemName=req.body.things_to_do;
    const listName= req.body.list;

const item= new Item({
  name: itemName
});

  if(listName==="Today"){
    item.save();
    res.redirect("/");
  }
  else{
List.findOne({name:listName},function(err,foundList){
  foundList.items.push(item);
  foundList.save();
  res.redirect("/"+listName);
});
}


});
// app.get("/work",(req,res)=>{
//   res.render("list",{listTitle:"workList",listItems:workItems});
// });
app.get("/:dynamic",(req,res)=>{
  const customListName=_.capitalize(req.params.dynamic);

List.findOne({name:customListName},function(err,foundItem){
  if(!err){
    if(!foundItem){
      const list =new List({
        name: customListName,
        items: defaultItems
      });
      list.save();
      res.redirect("/"+customListName);
    }
    else{
      res.render("list",{listTitle:foundItem.name,listItems:foundItem.items})
    }
  }
});
});




app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
