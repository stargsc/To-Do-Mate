const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const ejs = require("ejs");

const app = express();
const port = 3000;
const store = "data.json";

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let todoData = {
  items: ["Watch 'Black Mirror' episodes", "Morning jog for 30 minutes", "Plan a surprise date night with my love"],
  workitems: ["Become a certified web development expert","Achieve a CGPA of 9 or higher"],
};

function saveData() {
  fs.writeFileSync(store, JSON.stringify(todoData), "utf-8");
}

try {
  const data = fs.readFileSync(store, "utf-8");
  todoData = JSON.parse(data);
} catch (error) {
  console.error("Error reading data.json:", error);
}

app.get("/", function(req, res) {
  const today = new Date();
  const custom = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  const day = today.toLocaleDateString("en-US", custom);
  res.render("list", {
    listName: day,
    newListItems: todoData.items,
  });
});

app.post("/", (req, res) => {
  const item = req.body.newItem;
  const list = req.body.list;
  if (list === "Work") {
    todoData.workitems.push(item);
    saveData();
    res.redirect("/work");
  } else {
    todoData.items.push(item);
    saveData();
    res.redirect("/");
  }
});

app.get("/work", (req, res) => {
  res.render("list", {
    listName: "Work List",
    newListItems: todoData.workitems,
  });
});

app.post("/work", (req, res) => {
  const item = req.body.newItem;
  todoData.workitems.push(item);
  saveData();
  res.redirect("/work");
});

app.post("/delete", (req, res) => {
  const index = req.body.index;
  const list = req.body.list;
  if (list === "Work List") {
    todoData.workitems.splice(index, 1);
    saveData();
    res.redirect("/work");
  } else {
    todoData.items.splice(index, 1);
    saveData();
    res.redirect("/");
  }
});

app.listen(port, function() {
  console.log(`server started on port ${port}.`);
});
