const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        default: "your name",
    },
    address: {
        type: String,
        default: " your country",
    },
    about: {
        type: String,
        default: "about",
    },
    profileImage: {
        url: {
            type: String,
            default: "https://png.pngtree.com/png-vector/20191110/ourmid/pngtree-avatar-icon-profile-icon-member-login-vector-isolated-png-image_1978396.jpg", // Provide a default image URL
        },
        filename: {
            type: String,
            default: "default_image_filename.jpg", // Provide a default image filename
        },
    },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);