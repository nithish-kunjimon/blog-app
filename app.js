const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/restful_blog_app", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

const blogScheme = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {
    type: Date,
    default: Date.now,
  },
});
const Blog = mongoose.model("Blog", blogScheme);

//RESTFUL ROUTES
app.get("/", (req, res) => {
  res.redirect("/blogs");
});

//INDEX ROUTE
app.get("/blogs", (req, res) => {
  Blog.find({}, (err, blogs) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", {
        blogs: blogs,
      });
    }
  });
});

//NEW ROUTE
app.get("/blogs/new", (req, res) => {
  res.render("new");
});

//CREATE ROUTE
app.post("/blogs", (req, res) => {
  Blog.create(req.body.blog, (err, newBlog) => {
    if (err) {
      res.render("new");
    } else {
      res.redirect("/blogs");
    }
  });
});

//SHOW ROUTE
app.get("/blogs/:id", (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      res.redirect("index");
    } else {
      res.render("show", {
        blog: foundBlog,
      });
    }
  });
});

//EDIT ROUTE
app.get("/blogs/:id/edit", (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("edit", {
        blog: foundBlog,
      });
    }
  });
});

//UPDATE ROUTE
app.put("/blogs/:id", (req, res) => {
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

app.listen(3000, () => {
  console.log("Server Has Started!");
});
