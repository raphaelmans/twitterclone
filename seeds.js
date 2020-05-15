const mongoose = require('mongoose'),
Post = require('./models/posts'),
User = require('./models/user');

var data = [ 
    {username:"raphael", password:"thebest"},
    {username:"ericka", password:"prettiest"},
    {username:"jude", password:"mathgod"}
];


function seedDB(){
    User.deleteMany({},(err)=>{
        if(err){
            console.log(err);
        }
        console.log('removed Users');
        data.forEach((seed)=>{
            User.create(seed,(err,user)=>{
                if(err){
                    console.log(err);
                }else{
                    console.log("added user");
                    //create post
                    Post.create({
                        title: "sample post",
                        content: "This is the content",
                        image: "https://images.unsplash.com/photo-1587920114174-9494e30c1417?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
                    },(err,post)=>{
                        if(err){
                            console.log(err);
                        }else{
                            user.posts.push(post);
                            user.save();
                            console.log("created new post");
                        }
                    });
                    
                }
            });
        });
    })
}

module.exports = seedDB;