const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/restful_blog_app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(express.static("public"));
app.set("view engine", "ejs");

const blogScheme = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {
        type: Date,
        default: Date.now
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
                blogs: blogs
            });
        }
    });
});

//NEW ROUTE
app.get('/blogs/new', (req, res) => {
    res.render('new');
})

//CREATE ROUTE
app.post('/blogs', (req, res) => {
    Blog.create(req.body.blog, (err, newBlog) => {
        if (err) {
            res.render('new');
        } else {
            res.redirect('/blogs');
        }
    })
})

app.listen(3000, () => {
    console.log("Server Has Started!");
});