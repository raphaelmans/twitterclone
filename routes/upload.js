var express = require("express");
var router  = express.Router();
const mongoose = require('mongoose');
const crypto = require('crypto');
const path = require('path');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const Post = require('../models/posts'),
User = require('../models/user');



const mongoAtlasURI = 'mongodb+srv://belzbuu:cn1JHu4208@test-cluster-jmbnw.mongodb.net/test?retryWrites=true&w=majority';
const conn = mongoose.createConnection(mongoAtlasURI, {useUnifiedTopology: true,useNewUrlParser: true});



let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Create storage engine
const storage = new GridFsStorage({
    url: mongoAtlasURI,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
  });
  const upload = multer({ storage });

// @route GET /
// @desc Loads form


// router.get('/', (req, res) => {
//     gfs.files.find().toArray((err, files) => {
//       // Check if files
//       if (!files || files.length === 0) {
//         res.render('index', { files: false });
//       } else {
//         files.map(file => {
//           if (
//             file.contentType === 'image/jpeg' ||
//             file.contentType === 'image/png'
//           ) {
//             file.isImage = true;
//           } else {
//             file.isImage = false;
//           }
//         });
//         res.render('index', { files: files });
//       }
//     });
// });

  
  // @route POST /upload
  // @desc  Uploads file to DB
router.post('/upload', upload.single('file'), (req, res) => {
    // res.json({ file: req.file });
    console.log(req.body);
    var author = {
      id: req.user._id,
      username: req.user.username
    }
    if(req.file !== undefined){
      postObj = {
        title: req.body.post.title,
        content: req.body.post.content,
        image: req.file.filename,
        author: author
      }
    }else{
      postObj = {
        title: req.body.post.title,
        content: req.body.post.content,
        author: author
      }
    }

    Post.create(postObj,(err,post)=>{
      if(err){
          console.log(err);
          
      }else{
          console.log(post);
      }
     })
  // console.log(req);
  res.redirect('/home');
});



  
  // @route GET /files
  // @desc  Display all files in JSON
  router.get('/files', (req, res) => {
    gfs.files.find().toArray((err, files) => {
      // Check if files
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: 'No files exist'
        });
      }
      // Files exist
      return res.json(files);
    });
  });
  
  // @route GET /files/:filename
  // @desc  Display single file object
  router.get('/files/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists'
        });
      }
      // File exists
      return res.json(file);
    });
  });
  
  // @route GET /image/:filename
  // @desc Display Image
  router.get('/image/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists'
        });
      }
      // Check if image
      if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
        // Read output to browser
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
      } else {
        res.status(404).json({
          err: 'Not an image'
        });
      }
    });
  });

  //edit profile
  router.put('/:user_id/editprofile', upload.single('file'), (req, res) => {
    // res.json({ file: req.file });
    if(req.file !== undefined){
      User.findByIdAndUpdate(req.params.user_id,{profilepic:req.file.filename},(err,user)=>{
        if(err){
          console.log(err);
        }else{
          console.log(user);
          res.redirect(`/${req.params.user_id}/editprofile`);
        }
      });
    }else{
      res.redirect('/home');
    }
   
  // console.log(req);

});


  module.exports = router;