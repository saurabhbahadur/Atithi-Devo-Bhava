const User = require("../models/user");
const Blog = require("../models/blog");

module.exports.userBlogs = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUser = req.user;
        let posts;

        if (id) {
            // Fetch blogs for the specified user and populate the 'author' field
            posts = await Blog.find({ author: id }).populate('author');
        } else {
            // Fetch blogs from all users and populate the 'author' field
            posts = await Blog.find().populate('author');
        }

        res.render("blogs/index.ejs", { currentUser, posts }); // Pass currentUser and posts to the template
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
};


module.exports.postInBlogs = async (req, res) => {
    try {
        const { title, message } = req.body;
        
        // Find the current user
        const currentUser = req.user;
        if (!currentUser) {
            throw new Error("User not found");
        }
        
        // Create the new blog post object
        const newPost = new Blog({
            title: title,
            message: message,
            author: currentUser._id // Assuming currentUser is an instance of User model
        });
        
        // Save the new post
        await newPost.save();

        req.flash("success", "Successfully posted in blogs.");
        res.redirect('/blogs');
    } catch (err) {
        console.error(err);
        req.flash("error", "Failed to post in blogs.");
        res.redirect('/blogs');
    }
};

module.exports.deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id);
        console.log(blog);
        // Check if the blog post exists and if the current user is the author
        if (!blog) {
            req.flash("error", "Blog not found.");
            return res.redirect("/blogs");
        }
        if (!blog.author.equals(req.user._id)) {
            req.flash("error", "You are not authorized to delete this blog.");
            return res.redirect("/blogs");
        }

        // If the user is authorized, delete the blog post
        await Blog.findByIdAndDelete(id);
        req.flash("success", "Blog deleted successfully.");
        res.redirect("/blogs");
    } catch (error) {
        console.error("Error deleting blog:", error);
        req.flash("error", "Failed to delete blog.");
        res.redirect("/blogs");
    }
};
