const express = require("express"),
mongoose = require("mongoose"),
passport              = require('passport'),
LocalStrategy         = require('passport-local'),
passportLocalMongoose = require('passport-local-mongoose'),
flash         = require("connect-flash"),
app = express(),
bodyParser = require('body-parser'),
methodOverride = require('method-override'),
seedDB = require('./seeds'),
User = require("./models/user"),
Post = require("./models/posts"),
Comment = require("./models/comments");

const upload = require('./middleware/uploadfile');

//middleware
var middleware = require('./middleware');

//Routes
const uploadRoute = require('./routes/upload'),
indexRoute = require('./routes/index');




const mongoAtlasURI = 'mongodb+srv://belzbuu:cn1JHu4208@test-cluster-jmbnw.mongodb.net/test?retryWrites=true&w=majority';


const PORT = process.env.PORT || 3000;
// mongoose.connect('mongodb://localhost/twitterclone', {useNewUrlParser: true, useUnifiedTopology: true});
app.set("view engine","ejs");
mongoose.connect(mongoAtlasURI, {useUnifiedTopology: true,useNewUrlParser: true});
//create sample data
// seedDB();

app.use(express.static(__dirname+'/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));


//passport code
app.use(require('express-session')({
    secret: "Ericka is the most prettiest girl",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

//flash use
app.use(flash());


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//middleware variable constants
app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.errMessage = req.flash("err");
    res.locals.successMessage = req.flash("success");
    next();
});

//route use
app.use('/',uploadRoute);
app.use('/',indexRoute);



//NEWSFEED ROUTE
app.get('/home',middleware.isLoggedIn,(req,res)=>{
// app.get('/home',(req,res)=>{
  Post.find({}).sort({dateCreated: 'desc'}).populate("author.id").populate({path:"comments",populate:{path:'author.id'}}).exec((err,posts)=>{
      if(err){
          console.log(err);
      }else{

          res.render("home",{posts:posts});
      }
    })
    // res.render('upload');
});


//Show post



app.get("/:id/edit",(req,res)=>{
    Post.findById(req.params.id,(err,post)=>{
        if(err){
            console.log(err);
        }else{
            console.log(post);
            res.render("show",{post:post});
        }
    });
});


app.put("/:id/edit",upload.single('file'),(req,res)=>{
    if(req.file !== undefined){
      postObj = {
        title: req.body.post.title,
        content: req.body.post.content,
        image: req.file.filename,
      }
    }else{
      postObj = {
        title: req.body.post.title,
        content: req.body.post.content,

      }
    }

  Post.findByIdAndUpdate(req.params.id,postObj,(err,updated)=>{
      if(err){
          console.log(err);

      }else{
          console.log(updated);
          res.redirect('/home');
      }
  })
});

app.delete("/:id/deletepost",(req,res)=>{
    Post.findByIdAndRemove(req.params.id,(err)=>{
        if(err){
            console.log(err);
        }else{
            res.redirect('/home');
        }
    });
});

app.post("/:id/:comment_id/addcomment",(req,res)=>{

    Post.findById(req.params.id,(err,post)=>{

        if(err){
            console.log(err);
        }else{
            Comment.create(req.body.comment,(err,comment)=>{
                if(err){
                    console.log(err);
                }else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    post.comments.push(comment);
                    post.save();
                    console.log(comment);
                    res.redirect('/home');
                }
            });
        }
    });



});


//delete comment

app.delete("/:id/:comment_id/deletecomment",(req,res)=>{

    Post.findByIdAndUpdate(req.params.id,{$pull:{
        comments: req.params.comment_id
    }
    },(err)=>{
        if(err){
            console.log(err);
        }else{
            Comment.findByIdAndRemove(req.params.comment_id,(err)=>{
                if(err){
                    console.log(err);
                }else{
                    res.redirect('/home');
                }
            });
        }
    });


});


app.get("/:user_id/editprofile",(req,res)=>{
    User.findById(req.params.user_id,(err,user)=>{
        res.render("editprofile",{user:user});
    })

});

app.listen(PORT,()=>{
    console.log(`Server listening at port ${PORT}`);
})
