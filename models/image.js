
var mongoose = require("mongoose");

var imageSchema = new mongoose.Schema({
    fieldname: String,
    originalname: String,
    encoding: String,
    mimetype: String,
    filename: String,
    bucketName: String,
    chunkSize: Number,
    size: Number,
    md5: String,
    uploadDate: {type: Date, default: Date.now},
    contentType: String
});

// var imageUpload = mongoose.model("Images",imageSchema);

module.exports = imageSchema;