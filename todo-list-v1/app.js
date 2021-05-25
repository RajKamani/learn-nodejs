const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");



mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser: true, useUnifiedTopology: true});
const itemSchema = {
  name: String
} 
const Item = mongoose.model("Item",itemSchema); //Collection Or Table 
const cItem = mongoose.model("cItem",itemSchema); //Collection Or Table 

app.get("/", function (req, res) {
  const option = {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  let today = new Date();

  today = today.toLocaleDateString("en-US", option);

    Item.find({},function(err,items){
      res.render("list", { day: today, newItems: items});
    })

});

app.post("/", function (req, res) {
  if (req.body.btn === "Collage") {
      const newItem = new cItem({
        name:req.body.NewItem
      })
    newItem.save();
    res.redirect("/collage");
  } else {
    const newItem = new Item({
      name:req.body.NewItem
    })
    newItem.save();
    res.redirect("/");
  }
});

app.get("/collage", function (req, res) {
  
  cItem.find({},function(err,items){
    res.render("list", { day: "Collage", newItems: items });
  })
});

app.post("/delete", function (req, res) {
  

    const toBeDelete = req.body.cbDelete;
    Item.findByIdAndRemove(toBeDelete,function(err){
      if(err){
        console.log("Error in deleting.")
      }
      else{
        res.redirect("/")
      }
    })
    


  cItem.find({},function(err,items){
    res.render("list", { day: "Collage", newItems: items });
  })
});

app.listen(3000, function () {
  console.log("server is Running at port 3000");
});
