//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const port = process.env.PORT || 3000;
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect('mongodb+srv://admin-donal:hRvlRlR2bb3BXXvk@cluster0.tbfy1py.mongodb.net/todolistDB');
}


const itemSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model('item', itemSchema);

const Item1 = new Item ({
  name:'Welcome to your To-Do List!'
});

const Item2 = new Item ({
  name:'Hit the + button to add a new item'
});

const Item3 = new Item ({
  name:'<<-- Hit this to delete an item'
});

const defaultItems = [Item1, Item2, Item3];

const listSchema = {
  name: String,
  items: [itemSchema]
};

const List = mongoose.model("List", listSchema);


app.get("/", function(req, res) {
  if (process.env.NODE_ENV === 'test') {
    return res.status(200).send("ok");
  }

  Item.find({}, function(err, foundItems){

    if (foundItems.length === 0) {
      Item.insertMany(defaultItems,function (err){
        if (err) {
          console.log(err);
        } else {
          console.log("successfully added items");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }
  });


});

app.post("/", function(req, res){

const itemName = req.body.newItem;
const listName = req.body.list;

const item = new Item({
  name: itemName
});

if (listName === "Today"){
  item.save();
  res.redirect("/");
} else {
  List.findOne({name: listName}, function(err, foundList){
    foundList.items.push(item);
    foundList.save();
    res.redirect("/" + listName);
  })
}
});

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

    if (listName === "Today") {
      Item.findByIdAndRemove(checkedItemId, function(err){
        if (!err) {
          console.log("successfully deleted checked item");
          res.redirect("/");
        }
      });
    } else {
      List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
        if (!err){
          res.redirect("/" + listName)
        }
    });
  }


});

app.get("/:customListName", function(req,res){
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name: customListName}, function(err, foundList){
    if (!err) {
      if (!foundList){
        const list = new List({
          name: customListName,
          items: defaultItems
        });

        list.save();
        res.redirect("/" + customListName);
            } else {
//Show existing list
      res.render("list", {listTitle: foundList.name, newListItems: foundList.items})
      }
    }
  });
});

app.get("/about", function(req, res){
  res.render("about");
});

if (require.main === module) {
  app.listen(port, () => console.log(`todo-list app listening on port ${port}!`));
}

module.exports = app;
