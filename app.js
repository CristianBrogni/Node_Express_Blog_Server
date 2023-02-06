const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const blogRoutes = require("./routes/blogRoutes");

//express app
const app = express();

//connect to mongoDB
mongoose.set("strictQuery", true);

const dbURI = "Link to MongoDB ";

mongoose
	.connect(dbURI)
	.then((result) => app.listen(3000))
	.catch((err) => console.log(err));

//register view engine
app.set("view engine", "ejs");

// middleware & static files
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

//mongoose and mongo sandbox routes
app.get("/add-blog", (req, res) => {
	const blog = new Blog({
		title: "new blog 3",
		snippet: "about my new blog",
		body: "more abou my blog",
	});

	blog
		.save()
		.then((result) => {
			res.send(result);
		})
		.catch((err) => {
			console.log(err);
		});
});

app.get("/all-blogs", (req, res) => {
	Blog.find()
		.then((result) => {
			res.send(result);
		})
		.catch((err) => {
			console.log(err);
		});
});

app.get("/single-blog", (req, res) => {
	Blog.findById("63ddc267336df608ce4d3595")
		.then((response) => {
			res.send(response);
		})
		.catch((err) => {
			console.log(err);
		});
});

//routes
app.get("/", (req, res) => {
	res.redirect("/blogs");
});

app.get("/about", (req, res) => {
	res.render("about", { title: "About" });
});

//blog routes
app.use(blogRoutes);

//404 page

app.use((req, res) => {
	res.status(404).render("404", { title: "404" });
});
