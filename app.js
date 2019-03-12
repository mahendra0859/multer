const express = require('express'),
    app = express(),
    multer = require("multer"),
    storage = multer.diskStorage({
        destination: './public/uploads',
        filename: (req, file, cb) => {
            cb(null, Date.now() + '-' + file.originalname)
        }
    }),
    upload = multer({
        storage,
        limits: { fileSize: 1000000 },
        fileFilter: (req, file, cb) => {
            sanitizeFile(file, cb);
        }
    }).single('files');

function sanitizeFile(file, cb) {
    // Define the allowed extension
    let fileExts = ['png', 'jpg', 'jpeg', 'gif']
    // Check allowed extensions
    let isAllowedExt = fileExts.includes(file.originalname.split('.')[1].toLowerCase());
    // Mime type must be an image
    let isAllowedMimeType = file.mimetype.startsWith("image/")
    if (isAllowedExt && isAllowedMimeType) {
        return cb(null, true) // no errors
    }
    else {
        // pass error msg to callback, which can be displaye in frontend
        cb('Error: File type not allowed!')
    }
}
app.post('/upload', (req, res) => {
    // res.send('done');
    upload(req, res, (err) => {
        (err) ? res.send({ msg: err }) :(req.file == undefined) ? res.send({ msg: 'No file selected!' }) : res.send({ msg: 'File uploaded successfully!' })        
    })
})
app.listen(3002, () => console.log("Server is running on port number 3002"));