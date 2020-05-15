var mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');


var UserSchema = new mongoose.Schema({

    profilepic:String,
    username: String,
    password: String,
    posts:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ]
});
UserSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model("User", UserSchema);