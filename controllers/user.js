const User = require("../models/user.js");
const passport = require("passport");


// signup route get
module.exports.renderSignUpForm = (req, res) => {
    res.render("users/signup.ejs");
};

// signup route post

module.exports.signUp = async (req, res) => {
    try {
        let { email, username, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Your account is created successfullyt");
            res.redirect("/listings");
        })
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};


// login get 

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};


//  login route post

module.exports.logIn = async (req, res) => {
    console.log("Login route handler executed");
    console.log(passport.authenticate);
    req.flash("success", "Welcome to wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/profile/" + req.user._id;
    res.redirect(redirectUrl);
    return;
};


//  profile route controller
module.exports.userProfile = (req, res) => {
    res.render("users/profile.ejs", { user: req.user });
};

// userController.js

// editProfile controller get
module.exports.editProfile = async (req, res) => {
    console.log("Edit Profile Controller reached");
    try {
        let { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            req.flash("error", "This page is not available");
            res.redirect("/listings");
        }
         // Check if profileImage is present in the user object
         let originalProfileUrl = user.profileImage ? user.profileImage.url : null;

         if (originalProfileUrl) {
             // Modify the URL if needed
             originalProfileUrl = originalProfileUrl.replace("/upload", "/upload/w_250");
         }
        res.render("users/editProfile.ejs", { user ,originalProfileUrl });
    } catch (error) {
        console.error(error);
        req.flash("error", "Error loading profile");
        res.redirect("/listings");
    }
};

// updateProfile controller put
module.exports.updateProfile = async (req, res) => {
    console.log("Update Profile Controller reached");
    try {
        let { id } = req.params;
        const updatedUserData = req.body;

        // Update user data
        await User.findByIdAndUpdate(id, { $set: updatedUserData });

        // Handle profile image update
        if (req.file) {
            let url = req.file.path;
            let filename = req.file.filename;

            // Update the profileImage field
            await User.findByIdAndUpdate(id, { 
                profileImage: { url, filename } 
            });
        }

        req.flash("success", "Profile Updated!");
        res.redirect(`/profile/${id}`);
    } catch (error) {
        console.error(error);
        req.flash("error", "Error updating profile");
        res.redirect(`/profile/${id}`);
    }
};




// blog route controller
// blog route controller
// module.exports.userBogs = async (req, res) => {
//     try {
//         // Check if there's an ID parameter in the URL
//         const { id } = req.params;
//         const currentUser = req.user;

//         // Check if an ID is provided
//         if (id) {
//             // Fetch blogs for the specified user
//             const user = await User.findById(id);
//             if (!user) {
//                 console.log("User not found");
//                 return res.status(404).send("User not found");
//             }
//             // Render the blogs page with the user's blogs
//             res.render("users/blogs.ejs", { currentUser, id, posts: user.posts });
//         } else {
//             // Fetch blogs from all users
//             const allUsers = await User.find();
//             const allPosts = allUsers.flatMap(user => user.posts);
//             // Render the blogs page with posts from all users
//             res.render("users/blogs.ejs", { currentUser, posts: allPosts });
//         }
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).send("Internal Server Error");
//     }
// };

// module.exports.userBlogs = async (req, res) => {
//     try {
//         // Check if there's an ID parameter in the URL
//         const { id } = req.params;
       
//         // Check if an ID is provided
//         if (id) {
//             // Fetch blogs for the specified user
//             const user = await User.findById(id);
//             const currentUser = req.user;
//             if (!user) {
//                 console.log("User not found");
//                 return res.status(404).send("User not found");
//             }
//             // Render the blogs page with the user's blogs
//             res.render("users/blogs.ejs", { currentUser : currentUser, id: id, posts: user.posts });
//         } else {
//             // Fetch blogs from all users
//             const allUsers = await User.find();
//             const allPosts = allUsers.flatMap(user => user.posts);
//             // Render the blogs page with posts from all users
//             res.render("users/blogs.ejs", { posts: allPosts });
//         }
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).send("Internal Server Error");
//     }
// };
// userController.js

// Controller function to handle posting in blogs or feeds
// module.exports.postInBlogs = async (req, res) => {
//     try {
//         const { title, message } = req.body;
        
//         // Find the current user
//         const currentUser = req.user;
//         if (!currentUser) {
//             throw new Error("User not found");
//         }
        
//         // Ensure the currentUser.posts array exists, if not, initialize it
//         currentUser.posts = currentUser.posts || [];
        
//         // Create the new blog post object
//         const newPost = {
//             title: title,
//             message: message
//         };
        
//         // Add the new post to the user's posts array
//         currentUser.posts.push(newPost);
//         await currentUser.save();

//         req.flash("success", "Successfully posted in blogs.");
//         res.redirect('/blogs');
//     } catch (err) {
//         console.error(err);
//         req.flash("error", "Failed to post in blogs.");
//         res.redirect('/blogs');
//     }
// };

// // Controller function to delete a blog post
// module.exports.deletePost = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const post = await BlogPost.findById(id);

//         // Check if the current user is the creator of the post
//         if (!post.author.equals(req.user._id)) {
//             req.flash("error", "You are not authorized to delete this post.");
//             return res.redirect("/blogs");
//         }

//         // If user is authorized, delete the post
//         await BlogPost.findByIdAndDelete(id);
//         req.flash("success", "Post deleted successfully.");
//         res.redirect("/blogs");
//     } catch (err) {
//         console.error(err);
//         req.flash("error", "Failed to delete post.");
//         res.redirect("/blogs");
//     }
// };


// home controller
module.exports.home = (req, res) => {
    res.render("users/home.ejs");
};


//  about route controller
module.exports.about = (req, res) => {
    res.render("users/about.ejs");
};



// logout route
module.exports.logOut = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out");
        res.redirect("/listings");
    });
};